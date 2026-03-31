'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { getApiKey } from '@/lib/fullstack/apiKey'
import Anthropic from '@anthropic-ai/sdk'
import { stripWrapToken } from '@/lib/fullstack/chat'
import dynamic from 'next/dynamic'
import '@excalidraw/excalidraw/index.css'

const ExcalidrawDynamic = dynamic(
  () => import('@excalidraw/excalidraw').then(m => ({ default: m.Excalidraw })),
  {
    ssr: false,
    loading: () => (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-comment)', fontSize: '0.875rem', fontStyle: 'italic' }}>
        Loading canvas…
      </div>
    ),
  }
)

const MESSAGE_CAP = 50

function loadMessages(key: string): Message[] | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as Message[]) : null
  } catch {
    return null
  }
}

function saveMessages(key: string, messages: Message[]) {
  try {
    // Strip imageData before persisting — base64 PNGs are too large for localStorage
    const stripped = messages.map(({ imageData: _img, ...m }) => m)
    const capped = stripped.length > MESSAGE_CAP ? stripped.slice(-MESSAGE_CAP) : stripped
    localStorage.setItem(key, JSON.stringify(capped))
  } catch {
    // localStorage full or unavailable — silently skip
  }
}

function clearMessages(key: string) {
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

export interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
  promptContent: string
  phase: number
  storageKey?: string
  question?: string
}

interface Message {
  role: 'assistant' | 'user'
  content: string
  imageData?: string  // base64 PNG for drawing submissions — not persisted to localStorage
}

interface SummaryResult {
  strengths: string[]
  reinforce: string[]
  lookUp: string
}

const INITIAL_QUESTION = 'What can you tell me about this topic?'

const aiBubbleStyle: React.CSSProperties = {
  maxWidth: '85%',
  alignSelf: 'flex-start',
  padding: '10px 14px',
  borderRadius: '12px 12px 12px 3px',
  background: 'var(--bg-alt)',
  border: '1px solid var(--border)',
  fontSize: '0.9375rem',
  color: 'var(--fg)',
  lineHeight: 1.6,
}

const userBubbleStyle: React.CSSProperties = {
  maxWidth: '85%',
  alignSelf: 'flex-end',
  padding: '10px 14px',
  borderRadius: '12px 12px 3px 12px',
  background: 'var(--purple-tint)',
  border: '1px solid color-mix(in srgb, var(--purple) 25%, transparent)',
  fontSize: '0.9375rem',
  color: 'var(--fg)',
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
}

function buildSystemPrompt(promptContent: string, phase: number): string {
  return `You are a focused Socratic tutor for fullstack development. Your job is to guide
the learner through the concepts in the evaluation criteria below — not
reveal answers, but ask targeted questions and offer hints.

Rules:
1. Stay strictly on the topic defined by the evaluation criteria. If the
   user ventures into a different concept, acknowledge it briefly and
   redirect: "That's worth exploring — let's finish this topic first."
2. Never dump a list of what was missed. Instead, pick the most important
   gap and ask a hint question about it.
3. When the learner has sufficiently covered the key concepts, end your
   message with the exact string [[WRAP_SUGGESTED]] on its own line.
   Do not include any text after [[WRAP_SUGGESTED]].
4. Phase level: ${phase} (1=Novice, 2=Studied, 3=Expert). Calibrate depth.

Evaluation criteria:
${promptContent}`
}

export default function ChatSidebar({ isOpen, onClose, promptContent, phase, storageKey, question }: ChatSidebarProps) {
  const openingMessage = question ?? INITIAL_QUESTION

  const [messages, setMessages] = useState<Message[]>(() => {
    if (storageKey) {
      const saved = loadMessages(storageKey)
      if (saved && saved.length > 1) return saved
    }
    return [{ role: 'assistant', content: openingMessage }]
  })
  const [displayBuffer, setDisplayBuffer] = useState('')
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [summarizing, setSummarizing] = useState(false)
  const [wrapUpSuggested, setWrapUpSuggested] = useState(false)
  const [wrapUpDismissed, setWrapUpDismissed] = useState(false)
  const [summary, setSummary] = useState<SummaryResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [drawOpen, setDrawOpen] = useState(false)
  const [canvasReady, setCanvasReady] = useState(false)

  const excalidrawAPIRef = useRef<{ getSceneElements: () => readonly unknown[]; getFiles: () => Record<string, unknown> } | null>(null)
  const drawSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const drawingStorageKey = storageKey ? `${storageKey}:drawing` : null

  function getStoredDrawingElements(): unknown[] {
    if (!drawingStorageKey) return []
    try {
      const raw = localStorage.getItem(drawingStorageKey)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  const scrollRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, displayBuffer])

  useEffect(() => {
    if (storageKey && messages.length > 1) {
      saveMessages(storageKey, messages)
    }
  }, [messages, storageKey])

  const busy = streaming || summarizing

  function handleClose() {
    onClose()
    setDisplayBuffer('')
    setInput('')
    setError(null)
  }

  function handleReset() {
    if (storageKey) clearMessages(storageKey)
    if (drawingStorageKey) {
      try { localStorage.removeItem(drawingStorageKey) } catch { /* ignore */ }
    }
    setDrawOpen(false)
    onClose()
    setMessages([{ role: 'assistant', content: openingMessage }])
    setDisplayBuffer('')
    setInput('')
    setStreaming(false)
    setSummarizing(false)
    setWrapUpSuggested(false)
    setWrapUpDismissed(false)
    setSummary(null)
    setError(null)
  }

  function handleCanvasChange(elements: readonly unknown[]) {
    if (!drawingStorageKey) return
    if (drawSaveTimerRef.current) clearTimeout(drawSaveTimerRef.current)
    drawSaveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(drawingStorageKey, JSON.stringify(elements))
      } catch {
        // localStorage full — silently skip
      }
    }, 500)
  }

  async function handleSubmitDrawing() {
    if (busy || !excalidrawAPIRef.current) return

    const sceneElements = excalidrawAPIRef.current.getSceneElements()
    if (!sceneElements || (sceneElements as unknown[]).length === 0) return

    try {
      const { exportToBlob } = await import('@excalidraw/excalidraw')
      const blob = await exportToBlob({
        elements: sceneElements as never,
        appState: { exportBackground: true } as never,
        files: excalidrawAPIRef.current.getFiles() as never,
        maxWidthOrHeight: 800,
      })

      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        const base64 = dataUrl.split(',')[1]
        handleSend(base64)
      }
      reader.readAsDataURL(blob)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setError(`Failed to export drawing: ${msg}`)
    }
  }

  async function handleSend(imageData?: string) {
    const apiKey = getApiKey()
    if (!apiKey) {
      setError('No API key set. Add your Claude API key in Settings.')
      return
    }

    const textContent = imageData
      ? `Here is my diagram.${input.trim() ? '\n\n' + input.trim() : ''}`
      : input.trim()
    if (!textContent || busy) return

    setError(null)
    const userMessage: Message = {
      role: 'user',
      content: textContent,
      ...(imageData && { imageData }),
    }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setStreaming(true)
    setDisplayBuffer('')

    try {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

      const apiMessages: Anthropic.MessageParam[] = updatedMessages.map(m => {
        if (m.imageData) {
          return {
            role: 'user' as const,
            content: [
              {
                type: 'image' as const,
                source: {
                  type: 'base64' as const,
                  media_type: 'image/png' as const,
                  data: m.imageData,
                },
              },
              { type: 'text' as const, text: m.content },
            ],
          }
        }
        return {
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }
      })

      let accumulated = ''

      const stream = await client.messages.stream({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: buildSystemPrompt(promptContent, phase),
        messages: apiMessages,
      })

      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          accumulated += chunk.delta.text
          const { display, wrapDetected } = stripWrapToken(accumulated)
          setDisplayBuffer(display)
          if (wrapDetected) setWrapUpSuggested(true)
        }
      }

      const { display } = stripWrapToken(accumulated)
      const assistantMessage: Message = { role: 'assistant', content: display }
      setMessages(prev => [...prev, assistantMessage])
      setDisplayBuffer('')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setError(`Error: ${msg}`)
    } finally {
      setStreaming(false)
    }
  }

  async function handleWrapUp() {
    const apiKey = getApiKey()
    if (!apiKey) {
      setError('No API key set. Add your Claude API key in Settings.')
      return
    }
    if (busy) return

    setError(null)
    setSummarizing(true)

    try {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

      const summarySystemPrompt = `You are evaluating a learner's understanding based on the conversation below.
Return ONLY a valid JSON object — no markdown, no code fences, no extra text.
Shape:
{
  "strengths": ["what the learner demonstrated well", ...],
  "reinforce": ["concepts that need more work", ...],
  "lookUp": "one specific thing the learner should read about next"
}`

      const apiMessages = messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: summarySystemPrompt,
        messages: [
          ...apiMessages,
          { role: 'user', content: 'Please summarize this conversation.' },
        ],
      })

      const raw = response.content[0].type === 'text' ? response.content[0].text : ''
      const start = raw.indexOf('{')
      const end = raw.lastIndexOf('}')
      if (start === -1 || end === -1) throw new Error('No JSON object in response')
      const parsed: SummaryResult = JSON.parse(raw.slice(start, end + 1))
      setSummary(parsed)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setError(`Summary failed: ${msg}. Try again or keep going.`)
    } finally {
      setSummarizing(false)
    }
  }

  if (!mounted) return null
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[49]"
            style={{
              background: 'color-mix(in srgb, var(--fg) 20%, transparent)',
            }}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-screen z-50 bg-[var(--bg)] border-l border-l-[var(--border)] flex flex-col overflow-hidden"
            style={{
              width: drawOpen ? '100vw' : '420px',
              transition: 'width 0.3s ease',
              boxShadow: '-4px 0 24px color-mix(in srgb, var(--fg) 8%, transparent)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-4 h-[52px] border-b border-b-[var(--border)] shrink-0">
              <p className="font-[ui-monospace,monospace] text-[0.65rem] font-bold tracking-[0.1em] uppercase text-[var(--fg-gutter)] m-0 flex-1">
                Discuss it
              </p>
              <button
                onClick={() => {
                  setDrawOpen(prev => {
                    if (prev) {
                      if (drawSaveTimerRef.current) {
                        clearTimeout(drawSaveTimerRef.current)
                        drawSaveTimerRef.current = null
                      }
                      if (excalidrawAPIRef.current && drawingStorageKey) {
                        try {
                          localStorage.setItem(drawingStorageKey, JSON.stringify(excalidrawAPIRef.current.getSceneElements()))
                        } catch { /* ignore */ }
                      }
                      setCanvasReady(false)
                    }
                    return !prev
                  })
                }}
                className="flex items-center gap-1 px-3 py-[5px] rounded-[5px] border text-[0.75rem] font-medium transition-colors"
                style={{
                  background: drawOpen ? 'var(--fg)' : 'var(--bg-alt)',
                  color: drawOpen ? 'var(--bg)' : 'var(--fg-alt)',
                  borderColor: drawOpen ? 'var(--fg)' : 'var(--border)',
                  cursor: 'pointer',
                }}
              >
                ✏️ {drawOpen ? 'Drawing…' : 'Draw'}
              </button>
              <button
                onClick={handleWrapUp}
                disabled={busy}
                className="flex items-center gap-1 px-3 py-[5px] rounded-[5px] border text-[0.75rem] font-medium"
                style={{
                  background: 'var(--bg-alt)',
                  color: busy ? 'var(--fg-gutter)' : 'var(--fg-alt)',
                  borderColor: 'var(--border)',
                  cursor: busy ? 'not-allowed' : 'pointer',
                }}
              >
                ✓ Wrap Up
              </button>
              <button
                onClick={handleClose}
                className="bg-transparent border-0 cursor-pointer text-[var(--fg-comment)] text-[1.25rem] leading-none p-[4px] rounded-[4px] flex items-center justify-center ml-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 flex overflow-hidden relative" style={{ minHeight: 0 }}>
              {drawOpen && (
                <div className="flex flex-col border-r border-r-[var(--border)]" style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0 }}>
                      <ExcalidrawDynamic
                        excalidrawAPI={(api: unknown) => {
                          excalidrawAPIRef.current = api as typeof excalidrawAPIRef.current
                          setCanvasReady(true)
                        }}
                        initialData={{ elements: getStoredDrawingElements() as never[] }}
                        onChange={(elements: readonly unknown[]) => handleCanvasChange(elements)}
                        UIOptions={{ canvasActions: { export: false, loadScene: false, saveToActiveFile: false, saveAsImage: false } }}
                      />
                    </div>
                  </div>
                  <div className="border-t border-t-[var(--border)] p-3 bg-[var(--bg-alt)] shrink-0 flex justify-end">
                    <button
                      onClick={handleSubmitDrawing}
                      disabled={busy || !canvasReady}
                      className="px-4 py-[7px] rounded-[6px] border-0 text-[0.8125rem] font-semibold"
                      style={{
                        background: busy ? 'var(--bg-highlight)' : 'var(--purple)',
                        color: busy ? 'var(--fg-gutter)' : 'white',
                        cursor: busy ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {streaming ? 'Submitting…' : 'Submit drawing →'}
                    </button>
                  </div>
                </div>
              )}

              <div
                className="flex flex-col overflow-hidden"
                style={{ width: drawOpen ? '380px' : '100%', flexShrink: 0 }}
              >
                {summarizing && (
                  <div
                    className="absolute inset-0 flex items-center justify-center z-10"
                    style={{ background: 'color-mix(in srgb, var(--bg) 85%, transparent)' }}
                  >
                    <p className="text-[var(--fg-comment)] text-sm italic">Generating summary…</p>
                  </div>
                )}

                {summary ? (
                  <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
                    {summary.strengths.length > 0 && (
                      <div>
                        <p className="font-[ui-monospace,monospace] text-[0.65rem] font-bold tracking-[0.09em] uppercase text-[var(--green)] mb-2">
                          What you covered well
                        </p>
                        <ul className="m-0 pl-5">
                          {summary.strengths.map((s, i) => (
                            <li key={i} className="text-sm text-[var(--fg)] mb-1">{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {summary.reinforce.length > 0 && (
                      <div>
                        <p className="font-[ui-monospace,monospace] text-[0.65rem] font-bold tracking-[0.09em] uppercase text-[var(--orange)] mb-2">
                          Worth reinforcing
                        </p>
                        <ul className="m-0 pl-5">
                          {summary.reinforce.map((r, i) => (
                            <li key={i} className="text-sm text-[var(--fg)] mb-1">{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {summary.lookUp && (
                      <div
                        className="px-[14px] py-[10px] rounded-[6px] bg-[var(--blue-tint)]"
                        style={{ border: '1px solid color-mix(in srgb, var(--blue) 20%, transparent)' }}
                      >
                        <p className="font-[ui-monospace,monospace] text-[0.65rem] font-bold tracking-[0.09em] uppercase text-[var(--blue)] mb-[0.375rem]">
                          One thing to look up
                        </p>
                        <p className="text-[0.9375rem] text-[var(--fg)] m-0">{summary.lookUp}</p>
                      </div>
                    )}
                    <button
                      onClick={handleReset}
                      className="self-start px-4 py-[7px] rounded-[6px] border border-[var(--border)] bg-[var(--bg-alt)] text-[var(--fg-alt)] text-[0.8125rem] cursor-pointer"
                    >
                      ↩ Start over
                    </button>
                  </div>
                ) : (
                  <>
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                      {messages.map((msg, i) => (
                        <div key={i} style={msg.role === 'assistant' ? aiBubbleStyle : userBubbleStyle}>
                          {msg.role === 'assistant' ? (
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          ) : (
                            <>
                              {msg.imageData && (
                                <img
                                  src={`data:image/png;base64,${msg.imageData}`}
                                  alt="Submitted diagram"
                                  style={{ maxWidth: '100%', borderRadius: 6, marginBottom: 6, display: 'block' }}
                                />
                              )}
                              {msg.content}
                            </>
                          )}
                        </div>
                      ))}
                      {streaming && displayBuffer && (
                        <div style={aiBubbleStyle}><ReactMarkdown>{displayBuffer}</ReactMarkdown></div>
                      )}
                      {streaming && !displayBuffer && (
                        <div className="text-[var(--fg-gutter)] italic" style={aiBubbleStyle}>thinking…</div>
                      )}
                    </div>

                    {error && (
                      <div className="px-3 py-2 border-t border-t-[var(--border)] flex items-center gap-3 flex-wrap bg-[var(--bg-alt)]">
                        <p className="m-0 text-[0.8125rem]" style={{ color: 'var(--red, #e06c75)' }}>
                          {error}{' '}
                          {error.includes('API key') && (
                            <a href="/fullstack/settings" className="text-[var(--purple)]">Go to Settings →</a>
                          )}
                        </p>
                        {error.includes('Summary failed') && (
                          <button
                            onClick={handleWrapUp}
                            disabled={busy}
                            className="px-3 py-[4px] rounded-[5px] border border-[var(--border)] bg-[var(--bg)] text-[var(--fg-alt)] text-[0.8125rem]"
                            style={{ cursor: busy ? 'not-allowed' : 'pointer' }}
                          >
                            Retry summary
                          </button>
                        )}
                      </div>
                    )}

                    {wrapUpSuggested && !wrapUpDismissed && (
                      <div className="border-t border-t-[var(--border)] px-3 py-[0.625rem] bg-[var(--blue-tint)] flex items-center justify-between gap-3 shrink-0">
                        <p className="m-0 text-[0.8125rem] text-[var(--fg-alt)]">
                          Looks like we&apos;ve covered the main ideas — ready for a summary?
                        </p>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={handleWrapUp}
                            disabled={busy}
                            className="px-3 py-[5px] rounded-[5px] border-0 bg-[var(--blue)] text-white text-[0.8125rem] font-semibold"
                            style={{ cursor: busy ? 'not-allowed' : 'pointer' }}
                          >
                            Yes, wrap up
                          </button>
                          <button
                            onClick={() => setWrapUpDismissed(true)}
                            className="px-3 py-[5px] rounded-[5px] border border-[var(--border)] bg-[var(--bg)] text-[var(--fg-alt)] text-[0.8125rem] cursor-pointer"
                          >
                            Keep going
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="border-t border-t-[var(--border)] p-3 flex gap-2 items-end bg-[var(--bg-alt)] shrink-0">
                      <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSend()
                          }
                        }}
                        placeholder="Type your response… (Enter to send, Shift+Enter for newline)"
                        rows={1}
                        onInput={e => {
                          e.currentTarget.style.height = 'auto'
                          e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'
                        }}
                        disabled={busy}
                        className="flex-1 text-sm px-[10px] py-[8px] rounded-[6px] border border-[var(--border)] text-[var(--fg)] resize-none outline-none overflow-hidden min-h-[38px] max-h-[120px]"
                        style={{ fontFamily: 'inherit', background: busy ? 'var(--bg-highlight)' : 'var(--bg)' }}
                      />
                      <button
                        onClick={() => handleSend()}
                        disabled={busy || !input.trim()}
                        className="px-4 py-[7px] rounded-[6px] border-0 text-[0.8125rem] font-semibold whitespace-nowrap"
                        style={{
                          background: busy || !input.trim() ? 'var(--bg-highlight)' : 'var(--purple)',
                          color: busy || !input.trim() ? 'var(--fg-gutter)' : 'white',
                          cursor: busy || !input.trim() ? 'not-allowed' : 'pointer',
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
      )}
    </AnimatePresence>,
    document.body
  )
}
