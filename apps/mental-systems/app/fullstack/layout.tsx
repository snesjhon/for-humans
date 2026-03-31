import { AppTheme } from '@/components/AppTheme';

export default function FullstackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppTheme app="fullstack" />
      {children}
    </>
  );
}
