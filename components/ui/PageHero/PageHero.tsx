import React from 'react'

const HERO_GRADIENT =
  'linear-gradient(150deg, color-mix(in srgb, var(--purple) 10%, var(--bg)) 0%, color-mix(in srgb, var(--blue) 6%, var(--bg)) 50%, var(--bg) 90%)'

export function PageHero({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="px-10 pt-12 border-b border-b-[var(--border)]"
      style={{ background: HERO_GRADIENT }}
    >
      <div className="flex flex-col items-center py-10">
        {children}
      </div>
    </section>
  )
}
