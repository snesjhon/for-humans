'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Circle, CircleCheck } from 'lucide-react';
import { getApiKey } from '@/lib/claudeApiKey';
import Anthropic from '@anthropic-ai/sdk';
import { stripWrapToken } from '@/lib/frontend/chat';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  projectPath: string;
}

type Phase = 'loading' | 'ready' | 'error';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface EvalResult {
  covered: string[];
  missed: string[];
  followUp: string | null;
  promptContent: string;
}

function buildChatSystemPrompt(promptContent: string, covered: string[], missed: string[]): string {
  const coveredList = covered.map(c => `- ✓ ${c}`).join('\n') || '(none)';
  const missedList = missed.map(m => `- ○ ${m}`).join('\n') || '(none)';

  return `You are a Socratic tutor reviewing a learner's frontend code. You have already evaluated their work.

Evaluation results:
COVERED:
${coveredList}

STILL MISSING:
${missedList}

Help the learner understand their gaps. Ask focused questions, offer hints, but don't just hand over answers. Stay on the evaluation criteria below.

Evaluation criteria:
${promptContent}`;
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

export default function CheckWorkSidebar({ isOpen, onClose, slug, projectPath }: Props) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [evalResult, setEvalResult] = useState<EvalResult | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [displayBuffer, setDisplayBuffer] = useState('');
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, displayBuffer]);

  const runEvaluation = useCallback(async () => {
    const apiKey = getApiKey();
    if (!apiKey) {
      setError('No API key set. Add your Claude API key in User Settings.');
      setPhase('error');
      return;
    }

    setPhase('loading');
    setEvalResult(null);
    setMessages([]);
    setDisplayBuffer('');
    setStreaming(false);
    setError(null);

    try {
      const res = await fetch('/frontend/api/check-work', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, projectPath, apiKey }),
      });

      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({ error: 'Evaluation failed.' }));
        throw new Error(msg ?? 'Evaluation failed.');
      }

      const data: EvalResult = await res.json();
      setEvalResult(data);

      // seed the chat with the followUp as the opening assistant message
      if (data.followUp) {
        setMessages([{ role: 'assistant', content: data.followUp }]);
      }

      setPhase('ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setPhase('error');
    }
  }, [slug, projectPath]);

  useEffect(() => {
    if (isOpen) runEvaluation();
  }, [isOpen, runEvaluation]);

  async function handleSend() {
    if (!evalResult || !input.trim() || streaming) return;

    const apiKey = getApiKey();
    if (!apiKey) {
      setError('No API key set.');
      return;
    }

    const userMsg: Message = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setStreaming(true);
    setDisplayBuffer('');
    setError(null);

    try {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

      const stream = client.messages.stream({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: buildChatSystemPrompt(
          evalResult.promptContent,
          evalResult.covered,
          evalResult.missed,
        ),
        messages: updatedMessages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      });

      let accumulated = '';
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          accumulated += chunk.delta.text;
          const { display } = stripWrapToken(accumulated);
          setDisplayBuffer(display);
        }
      }

      const { display } = stripWrapToken(accumulated);
      setMessages(prev => [...prev, { role: 'assistant', content: display }]);
      setDisplayBuffer('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setStreaming(false);
    }
  }

  function handleClose() {
    onClose();
    setInput('');
    setDisplayBuffer('');
    setError(null);
  }

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[49] bg-[var(--ms-bg-pane-tertiary)]"
          />

          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-50 flex h-screen w-[420px] flex-col overflow-hidden border-l border-l-[var(--ms-surface)] bg-[var(--ms-bg-pane)]"
            style={{ boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.12)' }}
          >
            {/* Header */}
            <div className="flex h-[52px] shrink-0 items-center gap-2 border-b border-b-[var(--ms-surface)] px-4">
              <p className="m-0 flex-1 font-[ui-monospace,monospace] text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[var(--ms-text-faint)]">
                Check my work
              </p>
              {phase === 'ready' && (
                <button
                  onClick={runEvaluation}
                  disabled={streaming}
                  className={`rounded-[5px] border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] px-3 py-[5px] text-xs font-medium text-[var(--ms-text-muted)] ${streaming ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  Re-check
                </button>
              )}
              <button
                onClick={handleClose}
                className="ml-1 flex cursor-pointer items-center justify-center rounded border-0 bg-transparent p-[4px] text-[1.25rem] leading-none text-[var(--ms-text-subtle)]"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Loading */}
            {phase === 'loading' && (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm italic text-[var(--ms-text-faint)]">Checking your work…</p>
              </div>
            )}

            {/* Error */}
            {phase === 'error' && (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
                <p className="text-center text-sm text-[var(--ms-peach)]">{error}</p>
                {error?.includes('API key') ? (
                  <a href="/settings" className="text-sm text-[var(--ms-blue)]">
                    Go to User Settings →
                  </a>
                ) : (
                  <button
                    onClick={runEvaluation}
                    className="cursor-pointer rounded-md border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] px-4 py-[7px] text-sm text-[var(--ms-text-muted)]"
                  >
                    Try again
                  </button>
                )}
              </div>
            )}

            {/* Results + Chat */}
            {phase === 'ready' && evalResult && (
              <div className="flex flex-1 flex-col overflow-hidden min-h-0">
                {/* Evaluation results — 50% */}
                <div className="flex-1 overflow-y-auto space-y-3 border-b border-b-[var(--ms-surface)] p-4 min-h-0">
                  {evalResult.covered.length > 0 && (
                    <div>
                      <p className="mb-2 font-[ui-monospace,monospace] text-[0.6rem] font-bold uppercase tracking-[0.09em] text-[var(--ms-green)]">
                        Covered
                      </p>
                      <ul className="space-y-1">
                        {evalResult.covered.map((item, i) => (
                          <li key={i} className="flex gap-2 text-sm text-[var(--ms-text-muted)]">
                            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 stroke-[2.2] text-[var(--ms-green)]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {evalResult.missed.length > 0 && (
                    <div>
                      <p className="mb-2 font-[ui-monospace,monospace] text-[0.6rem] font-bold uppercase tracking-[0.09em] text-[var(--ms-peach)]">
                        Missed
                      </p>
                      <ul className="space-y-1">
                        {evalResult.missed.map((item, i) => (
                          <li key={i} className="flex gap-2 text-sm text-[var(--ms-text-muted)]">
                            <Circle className="mt-0.5 h-4 w-4 shrink-0 stroke-2 text-[var(--ms-peach)]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Chat (followUp + conversation) — 50% */}
                {messages.length > 0 && (
                  <div className="flex flex-1 flex-col overflow-hidden min-h-0">
                    <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
                      {messages.map((msg, i) => (
                        <div key={i} style={msg.role === 'assistant' ? aiBubbleStyle : userBubbleStyle}>
                          {msg.role === 'assistant' ? (
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          ) : (
                            msg.content
                          )}
                        </div>
                      ))}
                      {streaming && displayBuffer && (
                        <div style={aiBubbleStyle}>
                          <ReactMarkdown>{displayBuffer}</ReactMarkdown>
                        </div>
                      )}
                      {streaming && !displayBuffer && (
                        <div className="italic text-[var(--ms-text-faint)]" style={aiBubbleStyle}>
                          thinking…
                        </div>
                      )}
                    </div>

                    {error && (
                      <div className="shrink-0 border-t border-t-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] px-3 py-2">
                        <p className="m-0 text-[0.8125rem] text-[var(--ms-peach)]">{error}</p>
                      </div>
                    )}

                    <div className="flex shrink-0 items-end gap-2 border-t border-t-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] p-3">
                      <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        placeholder="Ask a follow-up… (Enter to send)"
                        rows={1}
                        onInput={e => {
                          e.currentTarget.style.height = 'auto';
                          e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                        }}
                        disabled={streaming}
                        className={`min-h-[38px] max-h-[120px] flex-1 resize-none overflow-hidden rounded-md border border-[var(--ms-surface)] px-2.5 py-[8px] text-sm text-[var(--ms-text-body)] outline-none font-[inherit] ${streaming ? 'bg-[var(--ms-bg-pane-tertiary)]' : 'bg-[var(--ms-bg-pane)]'}`}
                      />
                      <button
                        onClick={handleSend}
                        disabled={streaming || !input.trim()}
                        className={`whitespace-nowrap rounded-md border-0 px-4 py-[7px] text-[0.8125rem] font-semibold ${(streaming || !input.trim()) ? 'bg-[var(--ms-bg-pane-tertiary)] text-[var(--ms-text-faint)] cursor-not-allowed' : 'bg-[var(--ms-blue)] text-white cursor-pointer'}`}
                      >
                        {streaming ? 'Sending…' : 'Send'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
