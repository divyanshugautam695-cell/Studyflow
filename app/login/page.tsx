'use client';

import { FormEvent, useState } from 'react';
import { Github, GraduationCap, Mail, ShieldCheck } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const supabase = createClient();

  async function oauth(provider: 'google' | 'github') {
    setBusy(provider); setMessage('');
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/auth/callback` } });
    if (error) { setMessage(error.message); setBusy(null); }
  }

  async function magicLink(event: FormEvent) {
    event.preventDefault(); if (!email.trim()) return;
    setBusy('email'); setMessage('');
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: `${window.location.origin}/auth/callback` } });
    setBusy(null); setMessage(error ? error.message : 'Check your email for a secure StudyFlow sign-in link.');
  }

  return <main className="min-h-screen bg-[#f5f7fa] px-5 py-10"><div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center"><div className="grid w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl lg:grid-cols-2">
    <section className="hidden bg-[#102a43] p-10 text-white lg:block"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#102a43]"><GraduationCap/></div><b className="text-xl">StudyFlow</b></div><div className="mt-24 max-w-md"><p className="text-sm font-bold uppercase tracking-[.2em] text-blue-200">Your learning workspace</p><h1 className="mt-4 text-4xl font-black leading-tight">Learn chapter by chapter. Prepare with purpose.</h1><p className="mt-5 leading-7 text-blue-100/75">Save your class, subjects, progress, practice history and adaptive recommendations in one account.</p></div><div className="mt-16 flex items-center gap-3 text-sm text-blue-100"><ShieldCheck size={18}/> Secure authentication powered by Supabase Auth</div></section>
    <section className="p-7 sm:p-10"><div className="lg:hidden flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#102a43] text-white"><GraduationCap/></div><b className="text-lg">StudyFlow</b></div><div className="mt-8 lg:mt-2"><h2 className="text-3xl font-black text-slate-900">Welcome back</h2><p className="mt-2 text-sm text-slate-500">Sign in to keep your learning progress synced.</p></div>
      <div className="mt-7 grid gap-3 sm:grid-cols-2"><button onClick={()=>oauth('google')} disabled={!!busy} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50">{busy==='google'?'Opening…':'Continue with Google'}</button><button onClick={()=>oauth('github')} disabled={!!busy} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"><Github size={17}/>{busy==='github'?'Opening…':'GitHub'}</button></div>
      <div className="my-7 flex items-center gap-3"><div className="h-px flex-1 bg-slate-200"/><span className="text-xs font-bold uppercase tracking-wider text-slate-400">or email</span><div className="h-px flex-1 bg-slate-200"/></div>
      <form onSubmit={magicLink} className="space-y-3"><label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email address</label><div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-blue-400"><Mail size={17} className="text-slate-400"/><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="w-full py-3 text-sm outline-none"/></div><button disabled={!!busy} className="btn-primary w-full rounded-xl py-3 text-sm font-bold disabled:opacity-50">{busy==='email'?'Sending…':'Send secure sign-in link'}</button></form>
      {message&&<p className="mt-5 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">{message}</p>}<p className="mt-7 text-center text-xs leading-5 text-slate-400">By continuing, you agree to use StudyFlow for educational purposes.</p>
    </section></div></div></main>;
}
