'use client'

import { useState, useEffect } from 'react'
import { getApiKey, setApiKey, clearApiKey, maskApiKey } from '@/lib/fullstack/apiKey'
import { getProjectPath, setProjectPath, clearProjectPath } from '@/lib/fullstack/projectPath'

export default function SettingsPage() {
  const [storedKey, setStoredKey] = useState<string | null>(null)
  const [keyInput, setKeyInput] = useState('')
  const [keySaved, setKeySaved] = useState(false)

  const [storedPath, setStoredPath] = useState<string | null>(null)
  const [pathInput, setPathInput] = useState('')
  const [pathSaved, setPathSaved] = useState(false)

  useEffect(() => {
    setStoredKey(getApiKey())
    setStoredPath(getProjectPath())
  }, [])

  function handleSaveKey() {
    if (!keyInput.trim()) return
    setApiKey(keyInput.trim())
    setStoredKey(keyInput.trim())
    setKeyInput('')
    setKeySaved(true)
    setTimeout(() => setKeySaved(false), 2000)
  }

  function handleSavePath() {
    if (!pathInput.trim()) return
    setProjectPath(pathInput.trim())
    setStoredPath(pathInput.trim())
    setPathInput('')
    setPathSaved(true)
    setTimeout(() => setPathSaved(false), 2000)
  }

  return (
    <main className="max-w-[600px] mx-auto mt-[80px] px-6 space-y-[3rem]">
      <div>
        <h1 className="font-extrabold text-[1.5rem] mb-[0.5rem]">Settings</h1>
        <p className="text-[var(--fg-comment)] text-[0.9375rem]">
          Stored in your browser only. Never leaves your device.
        </p>
      </div>

      {/* API Key */}
      <section>
        <h2 className="font-bold text-[1rem] mb-[0.5rem]">Claude API Key</h2>
        <p className="text-[0.875rem] text-[var(--fg-comment)] mb-[1rem]">Used to evaluate your work and power the chat interface.</p>
        {storedKey && (
          <div className="mb-[1rem] py-[12px] px-[16px] rounded-[6px] bg-[var(--bg-alt)] border border-[var(--border)] flex justify-between items-center">
            <span className="font-[ui-monospace,monospace] text-[0.875rem]">{maskApiKey(storedKey)}</span>
            <button onClick={() => { clearApiKey(); setStoredKey(null) }} className="text-[0.8rem] text-[var(--fg-gutter)] bg-transparent border-none cursor-pointer">Clear</button>
          </div>
        )}
        <div className="flex gap-[8px]">
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder={storedKey ? 'Replace API key…' : 'sk-ant-…'}
            className="flex-1 py-[8px] px-[12px] rounded-[6px] border border-[var(--border)] bg-[var(--bg-alt)] text-[var(--fg)] text-[0.875rem]"
            onKeyDown={(e) => e.key === 'Enter' && handleSaveKey()}
          />
          <button onClick={handleSaveKey} className="py-[8px] px-[20px] rounded-[6px] bg-[var(--purple)] text-white font-semibold text-[0.875rem] border-none cursor-pointer">
            {keySaved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </section>

      {/* Chess App Path */}
      <section>
        <h2 className="font-bold text-[1rem] mb-[0.5rem]">Chess App Path</h2>
        <p className="text-[0.875rem] text-[var(--fg-comment)] mb-[1rem]">Absolute path to your local chess app directory. Used to read your code when checking work.</p>
        {storedPath && (
          <div className="mb-[1rem] py-[12px] px-[16px] rounded-[6px] bg-[var(--bg-alt)] border border-[var(--border)] flex justify-between items-center">
            <span className="font-[ui-monospace,monospace] text-[0.875rem] text-[var(--fg)]">{storedPath}</span>
            <button onClick={() => { clearProjectPath(); setStoredPath(null) }} className="text-[0.8rem] text-[var(--fg-gutter)] bg-transparent border-none cursor-pointer">Clear</button>
          </div>
        )}
        <div className="flex gap-[8px]">
          <input
            type="text"
            value={pathInput}
            onChange={(e) => setPathInput(e.target.value)}
            placeholder="/Users/you/chess-learning"
            className="flex-1 py-[8px] px-[12px] rounded-[6px] border border-[var(--border)] bg-[var(--bg-alt)] text-[var(--fg)] text-[0.875rem] font-[ui-monospace,monospace]"
            onKeyDown={(e) => e.key === 'Enter' && handleSavePath()}
          />
          <button onClick={handleSavePath} className="py-[8px] px-[20px] rounded-[6px] bg-[var(--purple)] text-white font-semibold text-[0.875rem] border-none cursor-pointer">
            {pathSaved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </section>
    </main>
  )
}
