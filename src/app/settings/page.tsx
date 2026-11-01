import { requirePageSession } from '@/lib/auth/server';
import SettingsWorkspace from '@/components/auth/SettingsWorkspace';

export default async function SettingsPage() {
  await requirePageSession('/settings');
  return <SettingsWorkspace />;
}
