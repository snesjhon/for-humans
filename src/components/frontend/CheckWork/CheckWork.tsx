'use client';

import { useEffect, useState } from 'react';
import { getProjectPath } from '@/lib/frontend/projectPath';
import CheckWorkSidebar from '@/components/frontend/CheckWorkSidebar/CheckWorkSidebar';

interface Props {
  slug: string;
}

export default function CheckWork({ slug }: Props) {
  const [projectPath, setProjectPath] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setProjectPath(getProjectPath());
  }, []);

  if (!projectPath) {
    return (
      <div className="mt-6 rounded-lg border border-[var(--ms-surface)] bg-[var(--ms-bg-pane-secondary)] p-4">
        <p className="text-sm text-[var(--ms-text-faint)]">
          Set your Plant Floor Monitor path in{' '}
          <a href="/frontend/settings" className="text-[var(--ms-blue)]">
            Settings
          </a>{' '}
          to enable work checking.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full cursor-pointer rounded-md border-0 bg-[var(--ms-blue)] px-5 py-[8px] text-sm font-semibold text-white"
        >
          Check my work
        </button>
      </div>

      <CheckWorkSidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        slug={slug}
        projectPath={projectPath}
      />
    </>
  );
}
