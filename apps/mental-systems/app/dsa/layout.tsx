import { AppTheme } from '@/components/AppTheme';

export default function DsaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppTheme app="dsa" />
      {children}
    </>
  );
}
