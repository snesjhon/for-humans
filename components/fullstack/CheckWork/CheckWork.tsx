'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { getApiKey } from '@/lib/fullstack/apiKey'
import { getProjectPath } from '@/lib/fullstack/projectPath'

interface CheckResult {
  covered: string[]
  missed: string[]
  followUp: string | null
}

interface Props {
  slug: string
}

const POLL_INTERVAL_MS = 30_000

export default function CheckWork({ slug }: Props) {
  const [projectPath, setProjectPath] = useState<string | null>(null)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [checking, setChecking] = useState(false)
  const [changesDetected, setChangesDetected] = useState(false)
  const lastHashRef = useRef<string>('')

  useEffect(() => {
    setProjectPath(getProjectPath())
    const stored = localStorage.getItem(`check-result:${slug}`)
    if (stored) setResult(JSON.parse(stored))
  }, [slug])

  const fetchHash = useCallback(async () => {
    if (!projectPath) return
    const res = await fetch('/fullstack/api/check-work/hash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, projectPath }),
    })
    const { hash } = await res.json()
    if (lastHashRef.current && hash !== lastHashRef.current) {
      setChangesDetected(true)
    }
    lastHashRef.current = hash
  }, [slug, projectPath])

  useEffect(() => {
    if (!projectPath) return
    fetchHash()
    const id = setInterval(fetchHash, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [fetchHash, projectPath])

  async function handleCheck() {
    const apiKey = getApiKey()
    if (!apiKey || !projectPath) return
    setChecking(true)
    setChangesDetected(false)
    const res = await fetch('/fullstack/api/check-work', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, projectPath, apiKey }),
    })
    const data: CheckResult = await res.json()
    setResult(data)
    localStorage.setItem(`check-result:${slug}`, JSON.stringify(data))
    setChecking(false)
    await fetchHash()
  }

  if (!projectPath) {
    return (
      <div className="mt-6 p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-alt)]">
        <p className="text-sm text-[var(--fg-gutter)]">
          Set your chess app path in{' '}
          <a href="/fullstack/settings" className="text-[var(--purple)]">Settings</a>{' '}
          to enable work checking.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-3">
      {changesDetected && (
        <div className="px-4 py-3 rounded-lg bg-[var(--purple-tint)] border border-[color-mix(in_srgb,var(--purple)_25%,transparent)] text-sm text-[var(--fg)]">
          New changes detected — ready to check?
        </div>
      )}

      <button
        onClick={handleCheck}
        disabled={checking}
        className="w-full py-[8px] px-[20px] rounded-[6px] bg-[var(--purple)] text-white text-sm font-semibold border-0 cursor-pointer disabled:opacity-50"
      >
        {checking ? 'Checking…' : 'Check my work'}
      </button>

      {result && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] p-4 space-y-3 text-sm">
          {result.covered.length > 0 && (
            <div>
              <p className="font-mono text-[0.6rem] font-bold tracking-[0.09em] uppercase text-[var(--green)] mb-2">Covered</p>
              <ul className="space-y-1">
                {result.covered.map((item, i) => (
                  <li key={i} className="flex gap-2 text-[var(--fg-alt)]">
                    <span className="text-[var(--green)] shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.missed.length > 0 && (
            <div>
              <p className="font-mono text-[0.6rem] font-bold tracking-[0.09em] uppercase text-[var(--orange)] mb-2">Missed</p>
              <ul className="space-y-1">
                {result.missed.map((item, i) => (
                  <li key={i} className="flex gap-2 text-[var(--fg-alt)]">
                    <span className="text-[var(--orange)] shrink-0">○</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.followUp && (
            <div className="pt-2 border-t border-[var(--border)]">
              <p className="font-mono text-[0.6rem] font-bold tracking-[0.09em] uppercase text-[var(--fg-gutter)] mb-2">Think about this</p>
              <p className="text-[var(--fg-alt)] leading-relaxed">{result.followUp}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
