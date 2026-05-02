'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { CircleCheck, PenTool } from 'lucide-react';
import dynamic from 'next/dynamic';
import Anthropic from '@anthropic-ai/sdk';
import '@excalidraw/excalidraw/index.css';
import { getApiKey } from '@/lib/claudeApiKey';
import { stripWrapToken } from '@/lib/system-design/chat';

const ExcalidrawDynamic = dynamic(
  () => import('@excalidraw/excalidraw').then((module) => ({ default: module.Excalidraw })),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--ms-text-subtle)',
          fontSize: '0.875rem',
          fontStyle: 'italic',
        }}
      >
        Loading canvas…
      </div>
    ),
  },
);

const MESSAGE_CAP = 50;

interface Message {
  role: 'assistant' | 'user';
  content: string;
  imageData?: string;
}

interface SummaryResult {
  strengths: string[];
  reinforce: string[];
  lookUp: string;
}

interface StoredDrawingScene {
  elements: unknown[];
  appState?: unknown;
  files?: Record<string, unknown>;
}

function sanitizeStoredAppState(appState: unknown): unknown {
  if (!appState || typeof appState !== 'object' || Array.isArray(appState)) {
    return undefined;
  }

  const sanitized = { ...(appState as Record<string, unknown>) };
  const collaborators = sanitized.collaborators;

  if (collaborators instanceof Map) {
    sanitized.collaborators = collaborators;
    return sanitized;
  }

  if (Array.isArray(collaborators)) {
    sanitized.collaborators = new Map(collaborators as Array<[string, unknown]>);
    return sanitized;
  }

  sanitized.collaborators = new Map();
  return sanitized;
}

export interface ExerciseChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  initialDrawOpen?: boolean;
  onDrawOpenChange?: (isOpen: boolean) => void;
  promptContent: string;
  phase: number;
  exerciseLabel: string;
  exerciseFile: string;
  exerciseGoal?: string;
  exerciseSource?: string;
  storageKey?: string;
}

const aiBubbleStyle: React.CSSProperties = {
  maxWidth: '85%',
  alignSelf: 'flex-start',
  padding: '10px 14px',
  borderRadius: '12px 12px 12px 3px',
  background: 'var(--ms-bg-pane-secondary)',
  border: '1px solid var(--ms-surface)',
  fontSize: '0.9375rem',
  color: 'var(--ms-text-body)',
  lineHeight: 1.6,
};

const userBubbleStyle: React.CSSProperties = {
  maxWidth: '85%',
  alignSelf: 'flex-end',
  padding: '10px 14px',
  borderRadius: '12px 12px 3px 12px',
  background: 'var(--ms-blue-surface)',
  border: '1px solid var(--ms-blue)',
  fontSize: '0.9375rem',
  color: 'var(--ms-text-body)',
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
};

function loadMessages(key: string): Message[] | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Message[]) : null;
  } catch {
    return null;
  }
}

function saveMessages(key: string, messages: Message[]) {
  try {
    const stripped = messages.map(({ imageData: _imageData, ...message }) => message);
    const capped = stripped.length > MESSAGE_CAP ? stripped.slice(-MESSAGE_CAP) : stripped;
    localStorage.setItem(key, JSON.stringify(capped));
  } catch {
    // ignore storage limits
  }
}

function clearMessages(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

function buildInitialQuestion(exerciseLabel: string, exerciseGoal?: string): string {
  if (exerciseGoal?.trim()) {
    return `Let's work through ${exerciseLabel}. Start by sketching the state changes or traversal you expect, then explain how that picture reaches: ${exerciseGoal}`;
  }

  return `Let's work through ${exerciseLabel}. Sketch the state changes you expect, then explain the invariant your algorithm needs to maintain.`;
}

function buildSystemPrompt(
  promptContent: string,
  phase: number,
  exerciseLabel: string,
  exerciseFile: string,
  exerciseGoal?: string,
  exerciseSource?: string,
): string {
  return `You are a focused Socratic tutor for DSA fundamentals exercises.

Your job is to reinforce the learner's algorithmic understanding for one exercise at a time.
The learner may submit Excalidraw diagrams. Treat the drawing as an attempt to express state, flow, or invariants.

Rules:
1. Stay strictly inside the current exercise and its underlying fundamental. If the learner drifts, redirect them back to the current exercise.
2. Ask pointed questions before offering explanations. Prefer the single most important next question.
3. If the learner submits a drawing, first interpret it charitably, name one thing it gets right, then ask the most important missing-state or invariant question.
4. Focus on mental models: state transitions, invariants, traversal order, termination, edge cases, and why the algorithm works.
5. Do not provide the full final code or a complete solution walkthrough unless the learner explicitly asks for it.
6. When the learner shows a solid mental model, end your response with the exact string [[WRAP_SUGGESTED]] on its own line.
7. Phase level: ${phase} (1=Novice, 2=Studied, 3=Expert). Calibrate the depth to that level.

Current exercise:
- Label: ${exerciseLabel}
- File: ${exerciseFile}
${exerciseGoal ? `- Goal: ${exerciseGoal}` : ''}

Starter file:
\`\`\`typescript
${exerciseSource ?? '// Source unavailable'}
\`\`\`

Exercise-specific tutoring criteria:
${promptContent}`;
}

export default function ExerciseChatSidebar({
  isOpen,
  onClose,
  initialDrawOpen = false,
  onDrawOpenChange,
  promptContent,
  phase,
  exerciseLabel,
  exerciseFile,
  exerciseGoal,
  exerciseSource,
  storageKey,
}: ExerciseChatSidebarProps) {
  const openingMessage = buildInitialQuestion(exerciseLabel, exerciseGoal);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (storageKey) {
      const saved = loadMessages(storageKey);
      if (saved && saved.length > 1) return saved;
    }

    return [{ role: 'assistant', content: openingMessage }];
  });
  const [displayBuffer, setDisplayBuffer] = useState('');
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [wrapUpSuggested, setWrapUpSuggested] = useState(false);
  const [wrapUpDismissed, setWrapUpDismissed] = useState(false);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drawOpen, setDrawOpen] = useState(initialDrawOpen);
  const [panelEntered, setPanelEntered] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [canvasInstanceKey, setCanvasInstanceKey] = useState(0);

  const busy = streaming || summarizing;
  const scrollRef = useRef<HTMLDivElement>(null);
  const excalidrawAPIRef = useRef<{
    getSceneElements: () => readonly unknown[];
    getAppState?: () => unknown;
    getFiles: () => Record<string, unknown>;
  } | null>(null);
  const drawSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suspendDrawingPersistenceRef = useRef(false);
  const drawingStorageKey = storageKey ? `${storageKey}:drawing` : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, displayBuffer]);

  useEffect(() => {
    if (storageKey && messages.length > 1) {
      saveMessages(storageKey, messages);
    }
  }, [messages, storageKey]);

  useEffect(() => {
    return () => {
      if (drawSaveTimerRef.current) {
        clearTimeout(drawSaveTimerRef.current);
      }
      suspendDrawingPersistenceRef.current = true;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setPanelEntered(false);
      setCanvasReady(false);
    } else {
      suspendDrawingPersistenceRef.current = false;
    }
  }, [isOpen]);

  function saveDrawingScene(scene: StoredDrawingScene) {
    if (!drawingStorageKey) return;

    try {
      localStorage.setItem(drawingStorageKey, JSON.stringify(scene));
    } catch {
      // ignore storage limits
    }
  }

  function persistCurrentDrawingScene() {
    if (!excalidrawAPIRef.current || !drawingStorageKey) return;

    saveDrawingScene({
      elements: [...excalidrawAPIRef.current.getSceneElements()],
      appState: excalidrawAPIRef.current.getAppState?.(),
      files: excalidrawAPIRef.current.getFiles(),
    });
  }

  function getStoredDrawingScene(): StoredDrawingScene {
    const emptyScene: StoredDrawingScene = { elements: [] };
    if (!drawingStorageKey) return emptyScene;

    try {
      const raw = localStorage.getItem(drawingStorageKey);
      if (!raw) return emptyScene;

      const parsed = JSON.parse(raw) as StoredDrawingScene | unknown[];
      if (Array.isArray(parsed)) {
        return { elements: parsed };
      }

      return {
        elements: Array.isArray(parsed.elements) ? parsed.elements : [],
        appState: sanitizeStoredAppState(parsed.appState),
        files: parsed.files,
      };
    } catch {
      return emptyScene;
    }
  }

  function handleClose() {
    if (drawSaveTimerRef.current) {
      clearTimeout(drawSaveTimerRef.current);
      drawSaveTimerRef.current = null;
    }

    suspendDrawingPersistenceRef.current = true;
    if (drawOpen) {
      persistCurrentDrawingScene();
    }

    excalidrawAPIRef.current = null;
    setCanvasReady(false);
    onClose();
    setDisplayBuffer('');
    setInput('');
    setError(null);
  }

  function handleReset() {
    if (storageKey) clearMessages(storageKey);
    if (drawingStorageKey) {
      try {
        localStorage.removeItem(drawingStorageKey);
      } catch {
        // ignore
      }
    }

    setDrawOpen(false);
    onDrawOpenChange?.(false);
    setCanvasReady(false);
    setCanvasInstanceKey((previous) => previous + 1);
    excalidrawAPIRef.current = null;
    onClose();
    setMessages([{ role: 'assistant', content: openingMessage }]);
    setDisplayBuffer('');
    setInput('');
    setStreaming(false);
    setSummarizing(false);
    setWrapUpSuggested(false);
    setWrapUpDismissed(false);
    setSummary(null);
    setError(null);
    suspendDrawingPersistenceRef.current = false;
  }

  function handleCanvasChange(
    elements: readonly unknown[],
    appState?: unknown,
    files?: Record<string, unknown>,
  ) {
    if (!drawingStorageKey || suspendDrawingPersistenceRef.current) return;

    if (drawSaveTimerRef.current) clearTimeout(drawSaveTimerRef.current);
    drawSaveTimerRef.current = setTimeout(() => {
      saveDrawingScene({
        elements: [...elements],
        appState,
        files,
      });
    }, 500);
  }

  async function handleSubmitDrawing() {
    if (busy || !excalidrawAPIRef.current) return;

    const sceneElements = excalidrawAPIRef.current.getSceneElements();
    if ((sceneElements as unknown[]).length === 0) return;

    try {
      const { exportToBlob } = await import('@excalidraw/excalidraw');
      const blob = await exportToBlob({
        elements: sceneElements as never,
        appState: { exportBackground: true } as never,
        files: excalidrawAPIRef.current.getFiles() as never,
        maxWidthOrHeight: 800,
      });

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(',')[1];
        void handleSend(base64);
      };
      reader.readAsDataURL(blob);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Unknown error';
      setError(`Failed to export drawing: ${message}`);
    }
  }

  async function handleSend(imageData?: string) {
    const apiKey = getApiKey();
    if (!apiKey) {
      setError('No API key set. Add your Claude API key in Settings.');
      return;
    }

    const textContent = imageData
      ? `Here is my exercise diagram.${input.trim() ? `\n\n${input.trim()}` : ''}`
      : input.trim();
    if (!textContent || busy) return;

    setError(null);
    const userMessage: Message = {
      role: 'user',
      content: textContent,
      ...(imageData ? { imageData } : {}),
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setStreaming(true);
    setDisplayBuffer('');

    try {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
      const apiMessages: Anthropic.MessageParam[] = updatedMessages.map((message) => {
        if (message.imageData) {
          return {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/png',
                  data: message.imageData,
                },
              },
              { type: 'text', text: message.content },
            ],
          };
        }

        return {
          role: message.role,
          content: message.content,
        };
      });

      let accumulated = '';
      const stream = await client.messages.stream({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: buildSystemPrompt(
          promptContent,
          phase,
          exerciseLabel,
          exerciseFile,
          exerciseGoal,
          exerciseSource,
        ),
        messages: apiMessages,
      });

      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          accumulated += chunk.delta.text;
          const { display, wrapDetected } = stripWrapToken(accumulated);
          setDisplayBuffer(display);
          if (wrapDetected) setWrapUpSuggested(true);
        }
      }

      const { display } = stripWrapToken(accumulated);
      setMessages((previous) => [...previous, { role: 'assistant', content: display }]);
      setDisplayBuffer('');
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Unknown error';
      setError(`Error: ${message}`);
    } finally {
      setStreaming(false);
    }
  }

  async function handleWrapUp() {
    const apiKey = getApiKey();
    if (!apiKey) {
      setError('No API key set. Add your Claude API key in Settings.');
      return;
    }
    if (busy) return;

    setError(null);
    setSummarizing(true);

    try {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
      const summarySystemPrompt = `You are evaluating a learner's understanding of a DSA exercise based on the conversation below.
Return ONLY a valid JSON object — no markdown, no code fences, no extra text.
Shape:
{
  "strengths": ["what the learner demonstrated well", ...],
  "reinforce": ["concepts or invariants that still need work", ...],
  "lookUp": "one specific thing the learner should study next"
}`;

      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: summarySystemPrompt,
        messages: [
          ...messages.map((message) => ({
            role: message.role as 'user' | 'assistant',
            content: message.content,
          })),
          { role: 'user', content: 'Please summarize this exercise discussion.' },
        ],
      });

      const raw =
        response.content[0]?.type === 'text' ? response.content[0].text : '';
      const start = raw.indexOf('{');
      const end = raw.lastIndexOf('}');

      if (start === -1 || end === -1) {
        throw new Error('No JSON object in response');
      }

      setSummary(JSON.parse(raw.slice(start, end + 1)) as SummaryResult);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Unknown error';
      setError(`Summary failed: ${message}. Try again or keep going.`);
    } finally {
      setSummarizing(false);
    }
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[49]"
            style={{ background: 'var(--ms-bg-pane-tertiary)' }}
          />

          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onAnimationComplete={() => setPanelEntered(true)}
            className="fixed right-0 top-0 z-50 flex h-screen flex-col overflow-hidden border-l border-l-[var(--ms-surface)] bg-[var(--ms-bg-pane)]"
            style={{
              width: drawOpen ? '100vw' : '440px',
              transition: 'width 0.3s ease',
              boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.12)',
            }}
          >
            <div className="flex h-[52px] items-center gap-2 border-b border-b-[var(--ms-surface)] px-4 shrink-0">
              <p className="m-0 flex-1 font-[ui-monospace,monospace] text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[var(--ms-text-faint)]">
                Exercise Diagram
              </p>
              <button
                onClick={() => {
                  setDrawOpen((previous) => {
                    const next = !previous;

                    if (previous) {
                      if (drawSaveTimerRef.current) {
                        clearTimeout(drawSaveTimerRef.current);
                        drawSaveTimerRef.current = null;
                      }

                      suspendDrawingPersistenceRef.current = true;
                      persistCurrentDrawingScene();
                      excalidrawAPIRef.current = null;

                      setCanvasReady(false);
                    } else {
                      suspendDrawingPersistenceRef.current = false;
                    }

                    onDrawOpenChange?.(next);
                    return next;
                  });
                }}
                className="flex items-center gap-1 rounded-[5px] border px-3 py-[5px] text-[0.75rem] font-medium transition-colors"
                style={{
                  background: drawOpen ? 'var(--ms-text-body)' : 'var(--ms-bg-pane-secondary)',
                  color: drawOpen ? 'var(--ms-bg-pane)' : 'var(--ms-text-muted)',
                  borderColor: drawOpen ? 'var(--ms-text-body)' : 'var(--ms-surface)',
                  cursor: 'pointer',
                }}
              >
                <PenTool className="h-3.5 w-3.5" />
                {drawOpen ? 'Diagramming' : 'Diagram'}
              </button>
              <button
                onClick={handleWrapUp}
                disabled={busy}
                className="flex items-center gap-1 rounded-[5px] border px-3 py-[5px] text-[0.75rem] font-medium"
                style={{
                  background: 'var(--ms-bg-pane-secondary)',
                  color: busy ? 'var(--ms-text-faint)' : 'var(--ms-text-muted)',
                  borderColor: 'var(--ms-surface)',
                  cursor: busy ? 'not-allowed' : 'pointer',
                }}
              >
                <CircleCheck className="h-3.5 w-3.5 stroke-[2.2]" />
                Wrap Up
              </button>
              <button
                onClick={handleClose}
                className="ml-1 flex items-center justify-center rounded-[4px] border-0 bg-transparent p-[4px] text-[1.25rem] leading-none text-[var(--ms-text-subtle)] cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 overflow-hidden">
              {drawOpen ? (
                <div
                  className="flex flex-col border-r border-r-[var(--ms-surface)]"
                  style={{ flex: 1, minWidth: 0 }}
                >
                  <div style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0 }}>
                      {panelEntered ? (
                        <ExcalidrawDynamic
                          key={canvasInstanceKey}
                          excalidrawAPI={(api: unknown) => {
                            suspendDrawingPersistenceRef.current = false;
                            excalidrawAPIRef.current = api as typeof excalidrawAPIRef.current;
                            setCanvasReady(true);
                          }}
                          initialData={getStoredDrawingScene() as never}
                          onChange={(
                            elements: readonly unknown[],
                            appState: unknown,
                            files: Record<string, unknown>,
                          ) => handleCanvasChange(elements, appState, files)}
                          UIOptions={{
                            canvasActions: {
                              export: false,
                              loadScene: false,
                              saveToActiveFile: false,
                              saveAsImage: false,
                            },
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--ms-text-subtle)',
                            fontSize: '0.875rem',
                            fontStyle: 'italic',
                          }}
                        >
                          Preparing canvas…
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end border-t border-t-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] p-3 shrink-0">
                    <button
                      onClick={() => void handleSubmitDrawing()}
                      disabled={busy || !canvasReady}
                      className="rounded-[6px] border-0 px-4 py-[7px] text-[0.8125rem] font-semibold"
                      style={{
                        background: busy ? 'var(--ms-bg-pane-tertiary)' : 'var(--ms-blue)',
                        color: busy ? 'var(--ms-text-faint)' : 'white',
                        cursor: busy ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {streaming ? 'Submitting…' : 'Submit diagram →'}
                    </button>
                  </div>
                </div>
              ) : null}

              <div
                className="flex flex-col overflow-hidden"
                style={{ width: drawOpen ? '400px' : '100%', flexShrink: 0 }}
              >
                {summarizing ? (
                  <div
                    className="absolute inset-0 z-10 flex items-center justify-center"
                    style={{ background: 'var(--ms-bg-pane)' }}
                  >
                    <p className="text-sm italic text-[var(--ms-text-subtle)]">
                      Generating summary…
                    </p>
                  </div>
                ) : null}

                {summary ? (
                  <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
                    {summary.strengths.length > 0 ? (
                      <div>
                        <p className="mb-2 font-[ui-monospace,monospace] text-[0.65rem] font-bold uppercase tracking-[0.09em] text-[var(--ms-green)]">
                          What you covered well
                        </p>
                        <ul className="m-0 pl-5">
                          {summary.strengths.map((item, index) => (
                            <li key={index} className="mb-1 text-sm text-[var(--ms-text-body)]">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {summary.reinforce.length > 0 ? (
                      <div>
                        <p className="mb-2 font-[ui-monospace,monospace] text-[0.65rem] font-bold uppercase tracking-[0.09em] text-[var(--ms-peach)]">
                          Worth reinforcing
                        </p>
                        <ul className="m-0 pl-5">
                          {summary.reinforce.map((item, index) => (
                            <li key={index} className="mb-1 text-sm text-[var(--ms-text-body)]">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {summary.lookUp ? (
                      <div
                        className="rounded-[6px] px-[14px] py-[10px] bg-[var(--ms-blue-surface)]"
                        style={{ border: '1px solid var(--ms-blue)' }}
                      >
                        <p className="mb-[0.375rem] font-[ui-monospace,monospace] text-[0.65rem] font-bold uppercase tracking-[0.09em] text-[var(--ms-blue)]">
                          One thing to look up
                        </p>
                        <p className="m-0 text-[0.9375rem] text-[var(--ms-text-body)]">
                          {summary.lookUp}
                        </p>
                      </div>
                    ) : null}
                    <button
                      onClick={handleReset}
                      className="self-start rounded-[6px] border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] px-4 py-[7px] text-[0.8125rem] text-[var(--ms-text-muted)] cursor-pointer"
                    >
                      ↩ Start over
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="border-b border-b-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] px-4 py-3">
                      <p className="m-0 text-sm font-semibold text-[var(--ms-text-body)]">
                        {exerciseLabel}
                      </p>
                      <p className="mt-1 mb-0 text-[0.8125rem] text-[var(--ms-text-subtle)]">
                        {exerciseGoal ?? exerciseFile}
                      </p>
                    </div>

                    <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          style={message.role === 'assistant' ? aiBubbleStyle : userBubbleStyle}
                        >
                          {message.role === 'assistant' ? (
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          ) : (
                            <>
                              {message.imageData ? (
                                <img
                                  src={`data:image/png;base64,${message.imageData}`}
                                  alt="Submitted diagram"
                                  style={{
                                    maxWidth: '100%',
                                    borderRadius: 6,
                                    marginBottom: 6,
                                    display: 'block',
                                  }}
                                />
                              ) : null}
                              {message.content}
                            </>
                          )}
                        </div>
                      ))}

                      {streaming && displayBuffer ? (
                        <div style={aiBubbleStyle}>
                          <ReactMarkdown>{displayBuffer}</ReactMarkdown>
                        </div>
                      ) : null}
                      {streaming && !displayBuffer ? (
                        <div className="italic text-[var(--ms-text-faint)]" style={aiBubbleStyle}>
                          thinking…
                        </div>
                      ) : null}
                    </div>

                    {error ? (
                      <div className="flex flex-wrap items-center gap-3 border-t border-t-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] px-3 py-2">
                        <p className="m-0 text-[0.8125rem]" style={{ color: 'var(--red, #e06c75)' }}>
                          {error}{' '}
                          {error.includes('API key') ? (
                            <a href="/settings" className="text-[var(--ms-blue)]">
                              Go to Settings →
                            </a>
                          ) : null}
                        </p>
                        {error.includes('Summary failed') ? (
                          <button
                            onClick={() => void handleWrapUp()}
                            disabled={busy}
                            className="rounded-[5px] border border-[var(--ms-surface)] bg-[var(--ms-bg-pane)] px-3 py-[4px] text-[0.8125rem] text-[var(--ms-text-muted)]"
                            style={{ cursor: busy ? 'not-allowed' : 'pointer' }}
                          >
                            Retry summary
                          </button>
                        ) : null}
                      </div>
                    ) : null}

                    {wrapUpSuggested && !wrapUpDismissed ? (
                      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-t-[var(--ms-surface)] bg-[var(--ms-blue-surface)] px-3 py-[0.625rem]">
                        <p className="m-0 text-[0.8125rem] text-[var(--ms-text-muted)]">
                          Looks like the core invariant is landing. Ready for a summary?
                        </p>
                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={() => void handleWrapUp()}
                            disabled={busy}
                            className="rounded-[5px] border-0 bg-[var(--ms-blue)] px-3 py-[5px] text-[0.8125rem] font-semibold text-white"
                            style={{ cursor: busy ? 'not-allowed' : 'pointer' }}
                          >
                            Yes, wrap up
                          </button>
                          <button
                            onClick={() => setWrapUpDismissed(true)}
                            className="rounded-[5px] border border-[var(--ms-surface)] bg-[var(--ms-bg-pane)] px-3 py-[5px] text-[0.8125rem] text-[var(--ms-text-muted)] cursor-pointer"
                          >
                            Keep going
                          </button>
                        </div>
                      </div>
                    ) : null}

                    <div className="flex shrink-0 items-end gap-2 border-t border-t-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] p-3">
                      <textarea
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault();
                            void handleSend();
                          }
                        }}
                        placeholder="Type your response… (Enter to send, Shift+Enter for newline)"
                        rows={1}
                        onInput={(event) => {
                          event.currentTarget.style.height = 'auto';
                          event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
                        }}
                        disabled={busy}
                        className="min-h-[38px] max-h-[120px] flex-1 resize-none overflow-hidden rounded-[6px] border border-[var(--ms-surface)] px-[10px] py-[8px] text-sm text-[var(--ms-text-body)] outline-none"
                        style={{
                          fontFamily: 'inherit',
                          background: busy
                            ? 'var(--ms-bg-pane-tertiary)'
                            : 'var(--ms-bg-pane)',
                        }}
                      />
                      <button
                        onClick={() => void handleSend()}
                        disabled={busy || !input.trim()}
                        className="whitespace-nowrap rounded-[6px] border-0 px-4 py-[7px] text-[0.8125rem] font-semibold"
                        style={{
                          background:
                            busy || !input.trim()
                              ? 'var(--ms-bg-pane-tertiary)'
                              : 'var(--ms-blue)',
                          color:
                            busy || !input.trim()
                              ? 'var(--ms-text-faint)'
                              : 'white',
                          cursor:
                            busy || !input.trim() ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {streaming ? 'Sending…' : 'Send'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
