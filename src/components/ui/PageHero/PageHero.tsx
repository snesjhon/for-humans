import React from 'react';

export function PageHero({ children }: { children: React.ReactNode }) {
  return (
    <section className="px-10 2xl:px-24 pt-12 border-b border-b-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)]">
      <div className="flex flex-col items-center py-10">{children}</div>
    </section>
  );
}
