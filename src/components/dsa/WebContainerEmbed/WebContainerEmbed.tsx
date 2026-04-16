'use client';

import { useEffect, useRef, useState } from 'react';
import { useTransition } from 'react';
import type { EditorView } from '@codemirror/view';
import type { Transaction } from '@codemirror/state';
import type { WebContainer } from '@webcontainer/api';
import { Check, Command, CornerDownLeft, Expand, Shrink } from 'lucide-react';
import useSWRImmutable from 'swr/immutable';
import { useSWRConfig } from 'swr';
import styles from './WebContainerEmbed.module.css';
import { useOptionalProgress } from '@/components/ui/ProgressProvider/ProgressProvider';
import {
  applyEditableSnippet,
  buildDsaCodeStorageKey,
  extractEditableSnippet,
  normalizeDsaEditorContent,
  parseStoredSnippet,
  serializeStoredSnippet,
  type DsaCodeBase,
} from '@/lib/dsa/codePersistence';

// Module-level refs populated by Effect 1 after imports resolve
let _Transaction: typeof Transaction | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _foldEffect: any = null;

const FOLDABLE_BLOCK_MARKERS = [
  '---Helpers',
  '---End Helpers',
  '─── Helpers',
  '─── End Helpers',
  '---Tests',
  '---End Tests',
  '─── Tests',
  '─── End Tests',
];

// Auto-fold helper and test blocks marked in the source file
function foldMarkedBlocks(view: EditorView) {
  if (!_foldEffect) return;
  const doc = view.state.doc;
  const markerLines: Array<{ from: number; to: number }> = [];

  for (let n = 1; n <= doc.lines; n += 1) {
    const line = doc.line(n);
    if (FOLDABLE_BLOCK_MARKERS.some((marker) => line.text.includes(marker))) {
      markerLines.push({ from: line.from, to: line.to });
    }
  }

  for (let i = 0; i < markerLines.length; i += 2) {
    const start = markerLines[i];
    const end = markerLines[i + 1];
    const foldTo = end ? end.to : doc.length;

    if (start.to < foldTo) {
      try {
        view.dispatch({
          effects: [_foldEffect.of({ from: start.to, to: foldTo })],
        });
      } catch {}
    }
  }
}

// Strip ANSI escape codes from terminal output
const stripAnsi = (s: string) => s.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '');

const RUN_TIMEOUT_MS = 5000;

// Singleton — one WebContainer per browsing context.
// Stored on globalThis so HMR module reloads don't trigger a re-install.
declare global {
  // eslint-disable-next-line no-var
  var __wcInstance: WebContainer | null | undefined;
  // eslint-disable-next-line no-var
  var __wcBootPromise: Promise<WebContainer> | null | undefined;
}

interface CodeSyncRecord {
  snippet: string;
  updatedAt: string;
}

function buildCodeSyncKey(base: DsaCodeBase, slug: string, file: string) {
  const params = new URLSearchParams({
    slug,
    file,
    base,
  });

  return `/api/dsa/code-sync?${params.toString()}`;
}

async function fetchCodeSyncRecord(
  url: string,
): Promise<CodeSyncRecord | null> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) return null;

  const data = (await response.json()) as {
    snippet: string | null;
    updatedAt?: string | null;
  };

  if (!data.snippet || !data.updatedAt) return null;

  return {
    snippet: data.snippet,
    updatedAt: data.updatedAt,
  };
}

async function getWebContainer(): Promise<WebContainer> {
  if (globalThis.__wcInstance) return globalThis.__wcInstance;
  if (!globalThis.__wcBootPromise) {
    globalThis.__wcBootPromise = (async () => {
      const { WebContainer } = await import('@webcontainer/api');
      const wc = await WebContainer.boot();

      await wc.fs.writeFile('.npmrc', 'registry=http://registry.npmjs.org/');
      await wc.fs.writeFile(
        'package.json',
        JSON.stringify(
          {
            name: 'dsa',
            dependencies: { tsx: 'latest' },
          },
          null,
          2,
        ),
      );

      const install = await wc.spawn('npm', ['install']);
      const installLog: string[] = [];
      install.output.pipeTo(
        new WritableStream({
          write(data) {
            installLog.push(stripAnsi(data));
          },
        }),
      );
      const code = await install.exit;
      if (code !== 0)
        throw new Error(`npm install failed:\n${installLog.join('')}`);

      globalThis.__wcInstance = wc;
      return wc;
    })().catch((err) => {
      globalThis.__wcBootPromise = null;
      throw err;
    });
  }
  return globalThis.__wcBootPromise;
}

interface Props {
  tabs: Array<{ label: string; file: string }>;
  step: number;
  total: number;
  contentSlug: string;
  progressStepId?: string;
  base?: DsaCodeBase;
  initialFiles?: Record<string, string>;
}

interface ExpandedLayout {
  left: number;
  top: number;
  width: number;
  height: number;
}

export default function WebContainerEmbed({
  tabs,
  step,
  total,
  contentSlug,
  progressStepId,
  base = 'problems',
  initialFiles = {},
}: Props) {
  const { mutate } = useSWRConfig();
  const progress = useOptionalProgress();
  const [isCompletingStep, startCompleteStepTransition] = useTransition();
  const [tabIdx, setTabIdx] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'booting' | 'running' | 'done' | 'error'
  >('idle');
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedLayout, setExpandedLayout] = useState<ExpandedLayout | null>(
    null,
  );
  const [inlineHeight, setInlineHeight] = useState<number | null>(null);

  const processRef = useRef<any>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const codeRef = useRef('');
  const activeFileRef = useRef('');
  const isResettingRef = useRef(false);
  const baseContentRef = useRef<Record<string, string>>({});
  const syncedSnippetRef = useRef<Record<string, string>>({});
  const dirtyFilesRef = useRef<Record<string, boolean>>({});
  const currentRequestRef = useRef(0);
  const currentRunIdRef = useRef(0);
  const handleEditorEscapeRef = useRef<(() => void) | null>(null);
  const runCodeRef = useRef<() => void>(() => {});
  const runTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep codeRef current on every render so Effect 1's async callback
  // always reads the latest value without a stale closure
  codeRef.current = code;
  runCodeRef.current = runCode;

  const activeFile = tabs[tabIdx]?.file ?? '';
  activeFileRef.current = activeFile;
  const isStepLoading = progressStepId
    ? (progress?.isLoading('step') ?? true)
    : false;
  const isStepComplete = progressStepId
    ? (progress?.isCompleted('step', progressStepId) ?? false)
    : false;
  const codeSyncKey = activeFile
    ? buildCodeSyncKey(base, contentSlug, activeFile)
    : null;
  const { data: remoteRecord, isLoading: isCodeSyncLoading } =
    useSWRImmutable<CodeSyncRecord | null>(codeSyncKey, fetchCodeSyncRecord);

  function storageKey(file: string) {
    return buildDsaCodeStorageKey(base, contentSlug, file);
  }

  async function syncSnippetToServer(file: string, snippet: string) {
    const key = buildCodeSyncKey(base, contentSlug, file);
    const response = await fetch(key, {
      method: snippet.trim() ? 'PUT' : 'DELETE',
      headers: snippet.trim()
        ? { 'Content-Type': 'application/json' }
        : undefined,
      body: snippet.trim() ? JSON.stringify({ snippet }) : undefined,
    });

    if (!response.ok && response.status !== 401) {
      throw new Error(`Code sync failed (${response.status})`);
    }

    if (response.ok) {
      await mutate(
        key,
        snippet.trim()
          ? {
              snippet,
              updatedAt: new Date().toISOString(),
            }
          : null,
        false,
      );
    }
  }

  async function syncActiveFileIfDirty(file: string, text: string) {
    const baseContent = baseContentRef.current[file];
    if (!baseContent) return;

    const snippet = extractEditableSnippet(text);
    const baseSnippet = extractEditableSnippet(baseContent);
    const syncedSnippet = syncedSnippetRef.current[file] ?? baseSnippet;

    if (snippet === syncedSnippet) {
      dirtyFilesRef.current[file] = false;
      return;
    }

    await syncSnippetToServer(file, snippet !== baseSnippet ? snippet : '');
    syncedSnippetRef.current[file] =
      snippet !== baseSnippet ? snippet : baseSnippet;
    dirtyFilesRef.current[file] = false;
  }

  function measureExpandedLayout() {
    const root = rootRef.current;
    if (!root || typeof window === 'undefined') return;

    const width = Math.max(320, Math.round(window.innerWidth * 0.8));
    const height = Math.max(420, Math.round(window.innerHeight * 0.8));
    const left = Math.round((window.innerWidth - width) / 2);
    const centeredTop = Math.round((window.innerHeight - height) / 2);
    const top = Math.max(16, Math.round(centeredTop * 0.6));

    setExpandedLayout({
      left,
      top,
      width,
      height,
    });
    setInlineHeight(root.getBoundingClientRect().height);
  }

  // Cmd/Ctrl+Enter to run — capture phase so vim never sees it first
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        handleEditorEscapeRef.current?.();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        runCodeRef.current();
      }
    };
    el.addEventListener('keydown', handler, true);
    return () => el.removeEventListener('keydown', handler, true);
  }, []);

  // Load file content when tab/file changes — sets code as reset trigger
  useEffect(() => {
    const requestId = currentRequestRef.current + 1;
    currentRequestRef.current = requestId;
    isResettingRef.current = true;
    setCode('');
    setOutput('');
    setStatus('idle');
    const content = initialFiles[activeFile];

    if (!content) {
      isResettingRef.current = false;
      return;
    }

    if (isCodeSyncLoading) {
      return;
    }

    const normalizedContent = normalizeDsaEditorContent(content);

    baseContentRef.current[activeFile] = normalizedContent;
    const localRecord = parseStoredSnippet(
      localStorage.getItem(storageKey(activeFile)),
    );

    if (currentRequestRef.current !== requestId) return;

    const preferredRecord =
      localRecord && remoteRecord
        ? new Date(localRecord.updatedAt).getTime() >=
          new Date(remoteRecord.updatedAt).getTime()
          ? localRecord
          : remoteRecord
        : (localRecord ?? remoteRecord);
    const baseSnippet = extractEditableSnippet(normalizedContent);
    const syncedSnippet = remoteRecord?.snippet ?? baseSnippet;
    const currentSnippet = preferredRecord?.snippet ?? baseSnippet;

    syncedSnippetRef.current[activeFile] = syncedSnippet;
    dirtyFilesRef.current[activeFile] = currentSnippet !== syncedSnippet;
    setCode(
      preferredRecord
        ? applyEditableSnippet(normalizedContent, preferredRecord.snippet)
        : normalizedContent,
    );

    try {
      if (preferredRecord) {
        localStorage.setItem(
          storageKey(activeFile),
          serializeStoredSnippet(preferredRecord),
        );
      } else {
        localStorage.removeItem(storageKey(activeFile));
      }
    } catch {}

    isResettingRef.current = false;
  }, [activeFile, base, contentSlug, initialFiles, isCodeSyncLoading]);

  // Effect 1: Mount CodeMirror once
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [
        { basicSetup },
        { EditorView },
        { Transaction },
        { HighlightStyle, syntaxHighlighting, foldEffect },
        { javascript },
        { vim, Vim, getCM },
        { tags },
      ] = await Promise.all([
        import('codemirror'),
        import('@codemirror/view'),
        import('@codemirror/state'),
        import('@codemirror/language'),
        import('@codemirror/lang-javascript'),
        import('@replit/codemirror-vim'),
        import('@lezer/highlight'),
      ]);

      if (cancelled || !editorRef.current) return;

      const theme = EditorView.theme({
        '&': {
          backgroundColor: 'var(--ms-bg-pane-secondary)',
          color: 'var(--ms-text-body)',
        },
        '.cm-content': {
          caretColor: 'var(--ms-cursor)',
          padding: '0.75rem 0',
        },
        '.cm-cursor': {
          borderLeftColor: 'var(--ms-cursor)',
          borderLeftWidth: '2px',
        },
        '.cm-activeLine': {
          backgroundColor:
            'color-mix(in srgb, var(--ms-text-body) 10%, transparent)',
        },
        '.cm-activeLineGutter': {
          backgroundColor:
            'color-mix(in srgb, var(--ms-text-body) 10%, transparent)',
        },
        '.cm-lineNumbers .cm-gutterElement': {
          color: 'var(--ms-overlay1)',
        },
        '.cm-activeLineGutter .cm-gutterElement': {
          color: 'var(--ms-lavender)',
        },
        '.cm-selectionBackground': {
          backgroundColor: 'var(--ms-selection) !important',
        },
        '&.cm-focused .cm-selectionBackground': {
          backgroundColor: 'var(--ms-selection) !important',
        },
        '.cm-gutters': {
          backgroundColor: 'var(--ms-bg-pane-secondary)',
          color: 'var(--ms-text-faint)',
          border: 'none',
          borderRight: '1px solid var(--ms-surface)',
          paddingRight: '4px',
        },
        '.cm-foldPlaceholder': {
          backgroundColor: 'var(--ms-bg-pane-tertiary)',
          border: '1px solid var(--ms-surface)',
          color: 'var(--ms-text-subtle)',
        },
      });

      const highlight = HighlightStyle.define([
        { tag: tags.keyword, color: 'var(--ms-mauve)', fontWeight: '600' },
        {
          tag: tags.controlKeyword,
          color: 'var(--ms-mauve)',
          fontWeight: '600',
        },
        {
          tag: tags.definitionKeyword,
          color: 'var(--ms-mauve)',
          fontWeight: '600',
        },
        {
          tag: tags.moduleKeyword,
          color: 'var(--ms-mauve)',
          fontWeight: '600',
        },
        { tag: tags.string, color: 'var(--ms-green)' },
        { tag: tags.special(tags.string), color: 'var(--ms-green)' },
        { tag: tags.number, color: 'var(--ms-peach)' },
        { tag: tags.bool, color: 'var(--ms-peach)' },
        { tag: tags.null, color: 'var(--ms-peach)' },
        { tag: tags.comment, color: 'var(--ms-overlay2)', fontStyle: 'italic' },
        {
          tag: tags.lineComment,
          color: 'var(--ms-overlay2)',
          fontStyle: 'italic',
        },
        {
          tag: tags.blockComment,
          color: 'var(--ms-overlay2)',
          fontStyle: 'italic',
        },
        { tag: [tags.typeName, tags.className], color: 'var(--ms-yellow)' },
        { tag: tags.propertyName, color: 'var(--ms-blue)' },
        { tag: tags.function(tags.variableName), color: 'var(--ms-blue)' },
        { tag: tags.definition(tags.variableName), color: 'var(--ms-maroon)' },
        { tag: tags.variableName, color: 'var(--ms-text-body)' },
        { tag: tags.operator, color: 'var(--ms-sky)' },
        { tag: tags.punctuation, color: 'var(--ms-overlay2)' },
        {
          tag: tags.invalid,
          color: 'var(--ms-red)',
          textDecoration: 'underline',
        },
        { tag: tags.angleBracket, color: 'var(--ms-overlay2)' },
      ]);

      const interceptKeys = EditorView.domEventHandlers({
        keydown(event) {
          if (event.key === 'Tab') {
            event.stopPropagation();
            event.preventDefault();
          }
        },
      });

      const saveToStorage = EditorView.updateListener.of((update) => {
        if (update.docChanged && !isResettingRef.current) {
          const file = activeFileRef.current;
          const baseContent = baseContentRef.current[file];
          if (!baseContent) return;

          const text = update.state.doc.toString();
          const snippet = extractEditableSnippet(text);
          const baseSnippet = extractEditableSnippet(baseContent);
          const syncedSnippet = syncedSnippetRef.current[file] ?? baseSnippet;
          const key = storageKey(file);

          try {
            if (snippet.trim() && snippet !== baseSnippet) {
              localStorage.setItem(
                key,
                serializeStoredSnippet({
                  snippet,
                  updatedAt: new Date().toISOString(),
                }),
              );
            } else {
              localStorage.removeItem(key);
            }
          } catch {}
          dirtyFilesRef.current[file] = snippet !== syncedSnippet;
        }
      });

      const view = new EditorView({
        doc: codeRef.current,
        extensions: [
          vim(),
          basicSetup,
          javascript({ typescript: true }),
          theme,
          syntaxHighlighting(highlight),
          interceptKeys,
          saveToStorage,
        ],
        parent: editorRef.current,
      });

      viewRef.current = view;
      _Transaction = Transaction; // make available to Effect 2
      _foldEffect = foldEffect; // make available to foldMarkedBlocks
      handleEditorEscapeRef.current = () => {
        const cm = getCM(view);
        if (cm) Vim.handleKey(cm, '<Esc>', 'user');
      };

      Vim.map('jj', '<Esc>', 'insert');

      foldMarkedBlocks(view);
    })();

    return () => {
      cancelled = true;
      handleEditorEscapeRef.current = null;
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isExpanded) return;

    measureExpandedLayout();
    viewRef.current?.focus();
    document.body.dataset.dfhWcExpandedOpen = 'true';
    document.body.style.overflow = 'hidden';
    const dimmedElements = Array.from(
      document.querySelectorAll('nav, [data-dfh-page-aside]'),
    ).filter((node): node is HTMLElement => node instanceof HTMLElement);
    const previousStyles = dimmedElements.map((element) => ({
      element,
      opacity: element.style.opacity,
      transition: element.style.transition,
    }));

    dimmedElements.forEach((element) => {
      element.style.opacity = '0.28';
      element.style.transition = 'opacity 0.18s ease';
    });

    const handleResize = () => measureExpandedLayout();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsExpanded(false);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      delete document.body.dataset.dfhWcExpandedOpen;
      document.body.style.overflow = '';
      previousStyles.forEach(({ element, opacity, transition }) => {
        element.style.opacity = opacity;
        element.style.transition = transition;
      });
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  useEffect(() => {
    if (!isExpanded) {
      setExpandedLayout(null);
      setInlineHeight(null);
    }
  }, [isExpanded]);

  useEffect(
    () => () => {
      if (runTimeoutRef.current) {
        clearTimeout(runTimeoutRef.current);
        runTimeoutRef.current = null;
      }
      if (processRef.current) {
        try {
          processRef.current.kill();
        } catch {}
      }
    },
    [],
  );

  // Effect 2: Sync external code changes into the editor
  useEffect(() => {
    const view = viewRef.current;
    if (!view || !_Transaction) return; // still loading; Effect 1 reads codeRef on init
    const current = view.state.doc.toString();
    if (current === code) return;

    view.dispatch({
      changes: { from: 0, to: current.length, insert: code },
      annotations: _Transaction.addToHistory.of(false),
    });
    foldMarkedBlocks(view);
  }, [code]);

  async function runCode() {
    // Read directly from editor — not from stale React state
    const currentCode = viewRef.current?.state.doc.toString() || code;
    const file = activeFileRef.current;
    if (!currentCode || !file) return;
    const runId = currentRunIdRef.current + 1;
    currentRunIdRef.current = runId;
    setOutput('');
    setStatus('booting');
    try {
      if (dirtyFilesRef.current[file]) {
        await syncActiveFileIfDirty(file, currentCode);
      }

      const wc = await getWebContainer();
      setStatus('running');
      if (processRef.current) {
        try {
          processRef.current.kill();
        } catch {}
      }
      if (runTimeoutRef.current) {
        clearTimeout(runTimeoutRef.current);
      }
      await wc.fs.writeFile(file, currentCode);
      const proc = await wc.spawn('node', [
        'node_modules/tsx/dist/cli.mjs',
        file,
      ]);
      processRef.current = proc;
      runTimeoutRef.current = setTimeout(() => {
        if (currentRunIdRef.current !== runId || processRef.current !== proc) {
          return;
        }
        setOutput(
          (p) =>
            `${p}${p ? '\n' : ''}Execution timed out after ${RUN_TIMEOUT_MS / 1000}s. It may be stuck in an infinite loop or deep recursion.`,
        );
        setStatus('error');
        try {
          proc.kill();
        } catch {}
      }, RUN_TIMEOUT_MS);
      proc.output.pipeTo(
        new WritableStream({
          write(data) {
            setOutput((p) => p + stripAnsi(data));
          },
        }),
      );
      const exit = await proc.exit;
      if (runTimeoutRef.current) {
        clearTimeout(runTimeoutRef.current);
        runTimeoutRef.current = null;
      }
      if (currentRunIdRef.current !== runId || processRef.current !== proc) {
        return;
      }
      processRef.current = null;
      setStatus(exit === 0 ? 'done' : 'error');
    } catch (err) {
      if (runTimeoutRef.current) {
        clearTimeout(runTimeoutRef.current);
        runTimeoutRef.current = null;
      }
      if (currentRunIdRef.current !== runId) {
        return;
      }
      processRef.current = null;
      setOutput((p) => (p ? p + '\n' : '') + String(err));
      setStatus('error');
    }
  }

  const hasCode = !!(viewRef.current?.state.doc.length || code.length);

  function handleCompleteStep() {
    if (!progressStepId || !progress) return;
    startCompleteStepTransition(() => {
      progress.toggle('step', progressStepId);
    });
  }

  const rootStyle =
    isExpanded && expandedLayout
      ? {
          position: 'fixed' as const,
          left: `${expandedLayout.left}px`,
          top: `${expandedLayout.top}px`,
          width: `${expandedLayout.width}px`,
          height: `${expandedLayout.height}px`,
          zIndex: 61,
        }
      : undefined;
  return (
    <>
      {isExpanded && (
        <button
          type="button"
          aria-label="Collapse editor"
          className="fixed inset-0 z-[60] cursor-default border-0 bg-[rgba(12,18,28,0.18)] backdrop-blur-[1.5px] backdrop-saturate-[80%]"
          onClick={() => setIsExpanded(false)}
        />
      )}
      <div
        style={inlineHeight ? { minHeight: `${inlineHeight}px` } : undefined}
      >
        <div
          ref={rootRef}
          className={`relative my-6 overflow-hidden rounded-lg border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] shadow-[0_0_0_rgba(0,0,0,0)] transition-[box-shadow,border-color] duration-150 ease-in-out ${
            isExpanded
              ? 'my-0 flex flex-col shadow-[0_28px_80px_rgba(15,23,42,0.18)]'
              : ''
          }`}
          style={rootStyle}
        >
          <div
            className={`flex min-h-0 flex-1 ${
              isExpanded ? 'flex-row' : 'flex-col'
            }`}
          >
            <div
              className={`flex min-h-0 flex-col ${
                isExpanded
                  ? 'min-w-0 basis-[70%] overflow-hidden border-r border-[var(--ms-surface)]'
                  : ''
              }`}
            >
              <div className="flex h-10 items-center justify-between border-b border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] px-3">
                {tabs.length > 1 && (
                  <div className="flex gap-0">
                    {tabs.map((t, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`m-0 h-10 w-auto border-none bg-transparent px-3.5 text-[13px] font-medium shadow-none transition-colors duration-150 ${
                          tabIdx === i
                            ? 'text-[var(--ms-blue)]'
                            : 'text-[var(--ms-text-faint)] hover:text-[var(--ms-text-muted)]'
                        }`}
                        onClick={() => setTabIdx(i)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                )}
                {tabs.length > 1 && (
                  <span className="font-mono text-[11px] text-[var(--ms-text-faint)]">
                    Step {step} of {total}
                  </span>
                )}
              </div>
              <div
                ref={editorRef}
                className={`${styles.editorShell} ${
                  isExpanded ? styles.editorShellExpanded : ''
                }`}
              />
            </div>
            <div
              className={`${
                isExpanded
                  ? 'flex min-w-0 basis-[30%] flex-col'
                  : 'overflow-y-auto'
              }`}
            >
              <div
                className={`flex items-center gap-3 border-b border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] px-3 py-2 ${
                  isExpanded ? 'h-10 shrink-0 py-0' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="px-2 py-1 text-xs align-center mb-0"
                    onClick={runCode}
                    disabled={
                      status === 'booting' || status === 'running' || !hasCode
                    }
                  >
                    {status === 'booting' ? (
                      globalThis.__wcInstance ? (
                        '⏳ Starting…'
                      ) : (
                        '⏳ Installing…'
                      )
                    ) : status === 'running' ? (
                      '⏳ Running…'
                    ) : (
                      <>
                        Run{' '}
                        <kbd className="p-0 bg-transparent ml-1 text-xs">
                          {typeof navigator !== 'undefined' &&
                          /Mac|iPhone|iPod|iPad/.test(navigator.platform) ? (
                            <Command className="h-2.5 w-2.5" />
                          ) : (
                            <span>Ctrl</span>
                          )}
                          <CornerDownLeft className="h-2.5 w-2.5" />
                        </kbd>
                      </>
                    )}
                  </button>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  {progressStepId ? (
                    <button
                      type="button"
                      className={`mb-0 px-3 py-1 text-xs transition-[color,border-color,background,opacity] duration-150 ${
                        isStepComplete
                          ? 'border-[var(--ms-green)] bg-[var(--ms-green-surface)] text-[var(--ms-green)] hover:opacity-85'
                          : 'border-[var(--ms-surface)] bg-transparent text-[var(--ms-text-muted)] hover:bg-[var(--ms-bg-pane-tertiary)] hover:text-[var(--ms-text-body)]'
                      }`}
                      onClick={handleCompleteStep}
                      disabled={isCompletingStep || isStepLoading}
                    >
                      <Check className="mr-1 h-3.5 w-3.5" />
                      {isCompletingStep
                        ? 'Saving…'
                        : isStepComplete
                          ? `Step ${step} completed`
                          : `Complete Step ${step}`}
                    </button>
                  ) : null}

                  <button
                    type="button"
                    className="px-2 py-1 mb-0 inline-flex "
                    onClick={() => {
                      if (!isExpanded) measureExpandedLayout();
                      setIsExpanded((prev) => !prev);
                    }}
                    aria-label={
                      isExpanded ? 'Collapse editor' : 'Expand editor'
                    }
                    title={isExpanded ? 'Collapse editor' : 'Expand editor'}
                  >
                    {isExpanded ? (
                      <Shrink className="h-4 w-4" />
                    ) : (
                      <Expand className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              {output && (
                <pre
                  className={`m-0 whitespace-pre-wrap break-all bg-[var(--ms-bg-pane)] px-5 py-4 font-mono text-[0.8125rem] leading-[1.6] text-[var(--ms-text-muted)] ${
                    isExpanded
                      ? 'flex-1 overflow-y-auto border-t-0'
                      : 'border-t border-[var(--ms-surface)]'
                  } ${
                    status === 'error'
                      ? 'bg-[var(--ms-bg-pane-tertiary)] text-[var(--ms-red)]'
                      : ''
                  }`}
                >
                  {output}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
