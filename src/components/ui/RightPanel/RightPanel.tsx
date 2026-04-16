import React from 'react';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';
import { UserAvatarDropdown } from '../UserAvatarDropdown/UserAvatarDropdown';

interface RightPanelProps {
  progress?: React.ReactNode;
  toc: React.ReactNode;
}

export function RightPanel({ progress, toc }: RightPanelProps) {
  return (
    <aside className="sticky top-0 flex h-screen flex-col border-l border-l-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)]">
      <div className="min-h-0 overflow-y-auto p-4">{toc}</div>

      <div className="border-t border-t-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] flex-1 p-4">
        {progress ? progress : null}
      </div>
      <div className="border-t border-t-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)]">
        <div className="flex items-center justify-between p-4">
          <UserAvatarDropdown compact />
          <ThemeSwitcher compact />
        </div>
      </div>
    </aside>
  );
}
