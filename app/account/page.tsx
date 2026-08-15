import { createClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';
import AccountActions from './AccountActions';

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return <main className="min-h-screen bg-[#f5f7fa] px-5 py-10"><div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#1769e0]">StudyFlow account</p><h1 className="mt-2 text-3xl font-black">Your learning profile</h1><div className="mt-6 rounded-2xl bg-slate-50 p-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Signed in as</p><p className="mt-2 font-semibold">{user.email || user.user_metadata?.full_name || 'StudyFlow student'}</p><p className="mt-2 text-xs text-slate-400">Provider: {user.app_metadata?.provider || 'email'}</p></div><div className="mt-6 flex gap-3"><a href="/" className="rounded-xl bg-[#1769e0] px-5 py-3 text-sm font-bold text-white">Dashboard</a><AccountActions/></div></div></main>;
}
