import { redirect } from 'next/navigation';
import { AuthForm } from '@/components/auth/AuthForm';
import { getSession } from '@/lib/auth/server';
import { safeDestination } from '@/lib/auth/validation';

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const destination = safeDestination((await searchParams).next || '/account');
  if (await getSession()) redirect(destination);
  return <AuthForm mode="signup" destination={destination} />;
}
