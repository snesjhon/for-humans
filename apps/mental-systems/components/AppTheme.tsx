'use client';

import { useEffect } from 'react';

interface AppThemeProps {
  app: 'dsa' | 'system-design' | 'fullstack';
}

export function AppTheme({ app }: AppThemeProps) {
  useEffect(() => {
    document.documentElement.setAttribute('data-app', app);
    return () => {
      document.documentElement.removeAttribute('data-app');
    };
  }, [app]);
  return null;
}
