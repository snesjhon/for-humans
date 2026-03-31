'use client'

import { useState, useEffect } from 'react'
import { getApiKey, setApiKey, clearApiKey, maskApiKey } from '@/lib/system-design/apiKey'

export default function SettingsPage() {
  const [stored, setStored] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setStored(getApiKey())
  }, [])

  function handleSave() {
    if (!input.trim()) return
    setApiKey(input.trim())
    setStored(input.trim())
    setInput('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleClear() {
    clearApiKey()
    setStored(null)
  }

  return (
    <main className="max-w-[600px] mx-auto mt-[80px] px-6">
      <h1 className="font-extrabold text-[1.5rem] mb-[0.5rem]">Settings</h1>
      <p className="text-[var(--fg-comment)] mb-[2rem] text-[0.9375rem]">
        Your API key is stored in your browser only. It never leaves your device.
      </p>

      {stored && (
        <div className="mb-[1.5rem] py-[12px] px-[16px] rounded-[6px] bg-[var(--bg-alt)] border border-[var(--border)] flex justify-between items-center">
          <span className="font-[ui-monospace,monospace] text-[0.875rem] text-[var(--fg)]">
            {maskApiKey(stored)}
          </span>
          <button onClick={handleClear} className="text-[0.8rem] text-[var(--fg-gutter)] bg-transparent border-none cursor-pointer">
            Clear
          </button>
        </div>
      )}

      <div className="flex gap-[8px]">
        <input
          type="password"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={stored ? 'Replace API key…' : 'sk-ant-…'}
          className="flex-1 py-[8px] px-[12px] rounded-[6px] border border-[var(--border)] bg-[var(--bg-alt)] text-[var(--fg)] text-[0.875rem]"
          onKeyDown={e => e.key === 'Enter' && handleSave()}
        />
        <button onClick={handleSave} className="py-[8px] px-[20px] rounded-[6px] bg-[var(--purple)] text-white font-semibold text-[0.875rem] border-none cursor-pointer">
          {saved ? 'Saved!' : 'Save'}
        </button>
      </div>
    </main>
  )
}
