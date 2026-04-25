import { redirect } from 'next/navigation';
import { UserSettingsPanel } from '@/components/ui/UserSettingsPanel/UserSettingsPanel';
import { createClient } from '@/lib/supabase/server';

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/settings');
  }

  return <UserSettingsPanel email={user.email ?? 'Unknown user'} />;
}
