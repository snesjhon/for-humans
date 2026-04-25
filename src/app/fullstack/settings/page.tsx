'use client'

import { useState, useEffect } from 'react'
import { getProjectPath, setProjectPath, clearProjectPath } from '@/lib/fullstack/projectPath'

export default function SettingsPage() {
  const [storedPath, setStoredPath] = useState<string | null>(null)
  const [pathInput, setPathInput] = useState('')
  const [pathSaved, setPathSaved] = useState(false)

  useEffect(() => {
    setStoredPath(getProjectPath())
  }, [])

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
        <h1 className="font-extrabold text-[1.5rem] mb-[0.5rem]">Fullstack Settings</h1>
        <p className="text-[var(--ms-text-subtle)] text-[0.9375rem]">
          Project-specific settings for fullstack work.
        </p>
      </div>

      <section>
        <h2 className="font-bold text-[1rem] mb-[0.5rem]">Chess App Path</h2>
        <p className="text-[0.875rem] text-[var(--ms-text-subtle)] mb-[1rem]">Absolute path to your local chess app directory. Used to read your code when checking work.</p>
        {storedPath && (
          <div className="mb-[1rem] py-[12px] px-[16px] rounded-[6px] bg-[var(--ms-bg-pane-secondary)] border border-[var(--ms-surface)] flex justify-between items-center">
            <span className="font-[ui-monospace,monospace] text-[0.875rem] text-[var(--ms-text-body)]">{storedPath}</span>
            <button onClick={() => { clearProjectPath(); setStoredPath(null) }} className="text-[0.8rem] text-[var(--ms-text-faint)] bg-transparent border-none cursor-pointer">Clear</button>
          </div>
        )}
        <div className="flex gap-[8px]">
          <input
            type="text"
            value={pathInput}
            onChange={(e) => setPathInput(e.target.value)}
            placeholder="/Users/you/chess-learning"
            className="flex-1 py-[8px] px-[12px] rounded-[6px] border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] text-[var(--ms-text-body)] text-[0.875rem] font-[ui-monospace,monospace]"
            onKeyDown={(e) => e.key === 'Enter' && handleSavePath()}
          />
          <button onClick={handleSavePath} className="py-[8px] px-[20px] rounded-[6px] bg-[var(--ms-blue)] text-white font-semibold text-[0.875rem] border-none cursor-pointer">
            {pathSaved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </section>

      <section>
        <h2 className="font-bold text-[1rem] mb-[0.5rem]">User Settings</h2>
        <p className="text-[0.875rem] text-[var(--ms-text-subtle)]">
          Claude API key and theme now live in <a href="/settings" className="text-[var(--ms-blue)]">user settings</a>.
        </p>
      </section>
    </main>
  )
}
