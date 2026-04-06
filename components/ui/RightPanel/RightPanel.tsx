import React from 'react';
import { UserAvatarDropdown } from '../UserAvatarDropdown/UserAvatarDropdown';

interface RightPanelProps {
  progress?: React.ReactNode;
  toc: React.ReactNode;
}

export function RightPanel({ progress, toc }: RightPanelProps) {
  return (
    <aside className="sticky top-0 flex h-screen flex-col overflow-y-auto border-l border-l-[var(--ctp-surface)] bg-[var(--ctp-bg-pane-secondary)]">
      <UserAvatarDropdown />
      {progress ? (
        <div className="shrink-0 border-b border-b-[var(--ctp-surface)] p-4">
          {progress}
        </div>
      ) : null}
      <div className="flex-1 overflow-y-auto p-4">{toc}</div>
    </aside>
  );
}
