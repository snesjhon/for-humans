import { AppTheme } from '@/components/ui/AppTheme/AppTheme';

export default function DsaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppTheme app="dsa" />
      {children}
    </>
  );
}
