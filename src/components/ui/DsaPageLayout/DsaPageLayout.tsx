import React from 'react';
import { RightPanel } from '../RightPanel/RightPanel';

interface DsaPageLayoutProps {
  hero: React.ReactNode;
  progress?: React.ReactNode;
  aside: React.ReactNode;
  children: React.ReactNode;
}

export function DsaPageLayout({
  hero,
  progress,
  aside,
  children,
}: DsaPageLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-[minmax(0,1fr)_260px]">
      <div className="min-w-0">
        {hero}
        <div className="px-10 2xl:px-24 py-10">{children}</div>
      </div>
      <RightPanel progress={progress} toc={aside} />
    </div>
  );
}
