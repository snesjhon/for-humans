'use client';

import { useEffect, useRef, useState } from 'react';
import type { EditorView } from '@codemirror/view';
import type { Transaction } from '@codemirror/state';
import type { WebContainer } from '@webcontainer/api';

// Module-level refs populated by Effect 1 after imports resolve
let _Transaction: typeof Transaction | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _foldEffect: any = null;

// Auto-fold everything below the helpers sentinel comment
function foldHelpers(view: EditorView) {
  if (!_foldEffect) return;
  const doc = view.state.doc;
  for (let n = 1; n <= doc.lines; n++) {
    const line = doc.line(n);
    if (line.text.includes('─── Helpers')) {
      if (line.to < doc.length) {
        try {
          view.dispatch({
            effects: [_foldEffect.of({ from: line.to, to: doc.length })],
          });
        } catch {}
      }
      return;
    }
  }
}

// Strip ANSI escape codes from terminal output
const stripAnsi = (s: string) => s.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '');

// Singleton — one WebContainer per browsing context
let wcInstance: WebContainer | null = null;
let wcBootPromise: Promise<WebContainer> | null = null;

async function getWebContainer(): Promise<WebContainer> {
  if (wcInstance) return wcInstance;
  if (!wcBootPromise) {
    wcBootPromise = (async () => {
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

      wcInstance = wc;
      return wc;
    })().catch((err) => {
      wcBootPromise = null;
      throw err;
    });
  }
  return wcBootPromise;
}

interface Props {
  tabs: Array<{ label: string; file: string }>;
  step: number;
  total: number;
  problemSlug: string;
  base?: string;
}

interface ExpandedLayout {
  left: number;
  top: number;
  width: number;
  height: number;
}

function lsKey(slug: string, file: string) {
  return `dfh-code:${slug}:${file}`;
}

export default function WebContainerEmbed({
  tabs,
  step,
  total,
  problemSlug,
  base,
}: Props) {
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
  const handleEditorEscapeRef = useRef<(() => void) | null>(null);
  const runCodeRef = useRef<() => void>(() => {});

  // Keep codeRef current on every render so Effect 1's async callback
  // always reads the latest value without a stale closure
  codeRef.current = code;
  runCodeRef.current = runCode;

  const activeFile = tabs[tabIdx]?.file ?? '';
  activeFileRef.current = activeFile;

  function measureExpandedLayout() {
    const root = rootRef.current;
    if (!root || typeof window === 'undefined') return;

    const pageLayout = root.closest('[data-dfh-page-layout]');
    const mainColumn = pageLayout?.querySelector('[data-dfh-page-main]');

    const horizontalMargin = window.innerWidth >= 1280 ? 24 : 16;
    const left = mainColumn instanceof HTMLElement
      ? mainColumn.getBoundingClientRect().left
      : horizontalMargin;
    const width = mainColumn instanceof HTMLElement
      ? mainColumn.getBoundingClientRect().width
      : window.innerWidth - horizontalMargin * 2;

    setExpandedLayout({
      left: Math.max(horizontalMargin, left),
      top: 24,
      width: Math.max(320, width),
      height: Math.max(420, window.innerHeight - 48),
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
    isResettingRef.current = true;
    setCode('');
    setOutput('');
    setStatus('idle');
    fetch(
      `/dsa/api/step-file?slug=${encodeURIComponent(problemSlug)}&file=${encodeURIComponent(activeFile)}${base ? `&base=${encodeURIComponent(base)}` : ''}`,
    )
      .then((r) => r.json())
      .then(({ content }) => {
        isResettingRef.current = false;
        if (content) {
          const saved = localStorage.getItem(lsKey(problemSlug, activeFile));
          setCode(saved || content);
        }
      })
      .catch(() => {
        isResettingRef.current = false;
      });
  }, [activeFile, problemSlug]);

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
          backgroundColor: 'var(--bg-alt)',
          color: 'var(--fg)',
        },
        '.cm-content': {
          caretColor: 'var(--fg)',
          padding: '0.75rem 0',
        },
        '.cm-cursor': {
          borderLeftColor: 'var(--fg)',
          borderLeftWidth: '2px',
        },
        '.cm-activeLine': { backgroundColor: 'var(--bg-highlight)' },
        '.cm-activeLineGutter': { backgroundColor: 'var(--bg-highlight)' },
        '.cm-selectionBackground': {
          backgroundColor: 'var(--sel-bg) !important',
        },
        '&.cm-focused .cm-selectionBackground': {
          backgroundColor: 'var(--sel-bg) !important',
        },
        '.cm-gutters': {
          backgroundColor: 'var(--bg-alt)',
          color: 'var(--fg-gutter)',
          border: 'none',
          borderRight: '1px solid var(--border)',
          paddingRight: '4px',
        },
        '.cm-foldPlaceholder': {
          backgroundColor: 'var(--bg-highlight)',
          border: '1px solid var(--border)',
          color: 'var(--fg-comment)',
        },
      });

      const highlight = HighlightStyle.define([
        { tag: tags.keyword, color: 'var(--purple)', fontWeight: '600' },
        { tag: tags.controlKeyword, color: 'var(--purple)', fontWeight: '600' },
        {
          tag: tags.definitionKeyword,
          color: 'var(--purple)',
          fontWeight: '600',
        },
        { tag: tags.moduleKeyword, color: 'var(--purple)', fontWeight: '600' },
        { tag: tags.string, color: 'var(--green)' },
        { tag: tags.special(tags.string), color: 'var(--green)' },
        { tag: tags.number, color: 'var(--orange)' },
        { tag: tags.bool, color: 'var(--orange)' },
        { tag: tags.null, color: 'var(--orange)' },
        { tag: tags.comment, color: 'var(--fg-comment)', fontStyle: 'italic' },
        {
          tag: tags.lineComment,
          color: 'var(--fg-comment)',
          fontStyle: 'italic',
        },
        {
          tag: tags.blockComment,
          color: 'var(--fg-comment)',
          fontStyle: 'italic',
        },
        { tag: [tags.typeName, tags.className], color: 'var(--blue)' },
        { tag: tags.propertyName, color: 'var(--cyan, var(--blue))' },
        { tag: tags.function(tags.variableName), color: 'var(--blue)' },
        { tag: tags.definition(tags.variableName), color: 'var(--fg)' },
        { tag: tags.variableName, color: 'var(--fg)' },
        { tag: tags.operator, color: 'var(--fg-alt)' },
        { tag: tags.punctuation, color: 'var(--fg-alt)' },
        { tag: tags.invalid, color: 'var(--red)', textDecoration: 'underline' },
        { tag: tags.angleBracket, color: 'var(--fg-alt)' },
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
          const text = update.state.doc.toString();
          try {
            if (text.trim()) {
              localStorage.setItem(
                lsKey(problemSlug, activeFileRef.current),
                text,
              );
            } else {
              localStorage.removeItem(
                lsKey(problemSlug, activeFileRef.current),
              );
            }
          } catch {}
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
      _foldEffect = foldEffect; // make available to foldHelpers
      handleEditorEscapeRef.current = () => {
        Vim.handleKey(getCM(view), '<Esc>', 'user');
      };

      Vim.map('jj', '<Esc>', 'insert');

      foldHelpers(view);
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
    document.body.classList.add('dfh-wc-expanded-open');
    document.body.style.overflow = 'hidden';

    const handleResize = () => measureExpandedLayout();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsExpanded(false);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('dfh-wc-expanded-open');
      document.body.style.overflow = '';
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
    foldHelpers(view);
  }, [code]);

  async function runCode() {
    // Read directly from editor — not from stale React state
    const currentCode = viewRef.current?.state.doc.toString() || code;
    if (!currentCode) return;
    setOutput('');
    setStatus('booting');
    try {
      const wc = await getWebContainer();
      setStatus('running');
      if (processRef.current) {
        try {
          processRef.current.kill();
        } catch {}
      }
      await wc.fs.writeFile(activeFile, currentCode);
      const proc = await wc.spawn('node', [
        'node_modules/tsx/dist/cli.mjs',
        activeFile,
      ]);
      processRef.current = proc;
      proc.output.pipeTo(
        new WritableStream({
          write(data) {
            setOutput((p) => p + stripAnsi(data));
          },
        }),
      );
      const exit = await proc.exit;
      setStatus(exit === 0 ? 'done' : 'error');
    } catch (err) {
      setOutput((p) => (p ? p + '\n' : '') + String(err));
      setStatus('error');
    }
  }

  const hasCode = !!(viewRef.current?.state.doc.length || code.length);
  const rootStyle = isExpanded && expandedLayout
    ? {
        position: 'fixed' as const,
        left: `${expandedLayout.left}px`,
        top: `${expandedLayout.top}px`,
        width: `${expandedLayout.width}px`,
        height: `${expandedLayout.height}px`,
        zIndex: 61,
      }
    : undefined;
  const bodyStyle = isExpanded
    ? { height: '100%', minHeight: expandedLayout?.height }
    : undefined;

  return (
    <>
      {isExpanded && (
        <button
          type="button"
          aria-label="Collapse editor"
          className="dfh-wc-overlay"
          onClick={() => setIsExpanded(false)}
        />
      )}
      <div style={inlineHeight ? { minHeight: `${inlineHeight}px` } : undefined}>
        <div
          ref={rootRef}
          className={`dfh-wc${isExpanded ? ' expanded' : ''}`}
          style={rootStyle}
        >
          <div className="dfh-wc-header">
            {tabs.length > 1 && (
              <div className="dfh-wc-tabs">
                {tabs.map((t, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`dfh-wc-tab${tabIdx === i ? ' active' : ''}`}
                    onClick={() => setTabIdx(i)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
            {tabs.length > 1 && (
              <span className="dfh-wc-step">
                Step {step} of {total}
              </span>
            )}
          </div>
          <div className="dfh-wc-body" style={bodyStyle}>
            <div ref={editorRef} className="dfh-wc-editor" />
            <div className="dfh-wc-toolbar">
              <button
                type="button"
                className="dfh-wc-run"
                onClick={runCode}
                disabled={
                  status === 'booting' || status === 'running' || !hasCode
                }
              >
                {status === 'booting' ? (
                  '⏳ Installing…'
                ) : status === 'running' ? (
                  '⏳ Running…'
                ) : (
                  <>
                    Run{' '}
                    <kbd className="dfh-wc-kbd">
                      {typeof navigator !== 'undefined' &&
                      /Mac|iPhone|iPod|iPad/.test(navigator.platform)
                        ? '⌘'
                        : 'Ctrl'}
                      ↵
                    </kbd>
                  </>
                )}
              </button>
              <button
                type="button"
                className="dfh-wc-expand"
                onClick={() => {
                  if (!isExpanded) measureExpandedLayout();
                  setIsExpanded((prev) => !prev);
                }}
              >
                {isExpanded ? 'Collapse' : 'Expand Editor'}
              </button>
            </div>
            {output && (
              <pre
                className={`dfh-wc-output${status === 'error' ? ' error' : ''}`}
              >
                {output}
              </pre>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
