'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';

export default function AccountActions() {
  const router = useRouter();
  const supabase = createClient();
  async function signOut() {
    await supabase.auth.signOut();
    router.replace('/login');
  }
  return <button onClick={signOut} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700">Sign out</button>;
}
