import React from 'react'

export function PageHero({ children }: { children: React.ReactNode }) {
  return (
    <section className="px-10 pt-12 border-b border-b-[var(--border)] bg-[var(--bg-alt)]">
      <div className="flex flex-col items-center py-10">
        {children}
      </div>
    </section>
  )
}
