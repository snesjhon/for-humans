import React from 'react';

export function PageHero({ children }: { children: React.ReactNode }) {
  return (
    <section className="px-24 pt-12 border-b border-b-[var(--ctp-surface)] bg-[var(--ctp-bg-pane-secondary)]">
      <div className="flex flex-col items-center py-10">{children}</div>
    </section>
  );
}
