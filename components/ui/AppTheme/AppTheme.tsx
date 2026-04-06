'use client';

import { useEffect } from 'react';
import { applyThemeFlavor, getStoredThemeFlavor } from '@/lib/theme';

interface AppThemeProps {
  app: 'dsa' | 'system-design' | 'fullstack';
}

export function AppTheme({ app }: AppThemeProps) {
  useEffect(() => {
    document.documentElement.setAttribute('data-app', app);
    applyThemeFlavor(getStoredThemeFlavor());

    return () => {
      document.documentElement.removeAttribute('data-app');
    };
  }, [app]);
  return null;
}
