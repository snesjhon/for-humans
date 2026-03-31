import { AppTheme } from '@/components/AppTheme';

export default function SystemDesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppTheme app="system-design" />
      {children}
    </>
  );
}
