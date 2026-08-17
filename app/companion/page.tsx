'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Brain, Clock3, HeartHandshake, History, Plus, Send, Sparkles, Target, X } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string };
type Session = { id: string; title: string; messages: Message[]; updatedAt: number };

const initial: Message[] = [{ role: 'assistant', content: "Hey. I'm NJACP. You don't have to have everything figured out. Tell me what's going on — I'll listen first, without judging you." }];
const starters = ['I feel overwhelmed by my studies.', 'I failed a test and don’t know what to do.', 'Help me make a study plan for today.', 'I just need someone to listen.'];

export default function CompanionPage() {
  const [messages, setMessages] = useState<Message[]>(initial);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [energy, setEnergy] = useState(6);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    try { const saved = localStorage.getItem('studyflow-njacp-sessions'); if (saved) setSessions(JSON.parse(saved)); } catch {}
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSeconds(s => {
        if (s > 0) return s - 1;
        setMinutes(m => {
          if (m <= 1) { setRunning(false); return 0; }
          return m - 1;
        });
        return 59;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const timeLabel = useMemo(() => `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`, [minutes, seconds]);

  function saveSession(next: Message[]) {
    const title = next.find(m => m.role === 'user')?.content.slice(0, 42) || 'New conversation';
    const session: Session = { id: Date.now().toString(), title, messages: next, updatedAt: Date.now() };
    const updated = [session, ...sessions].slice(0, 10);
    setSessions(updated);
    localStorage.setItem('studyflow-njacp-sessions', JSON.stringify(updated));
  }

  async function sendMessage(text = input) {
    const value = text.trim();
    if (!value || loading) return;
    const next = [...messages, { role: 'user', content: value } as Message];
    setMessages(next); setInput(''); setLoading(true);
    try {
      const res = await fetch('/api/njacp/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next }) });
      const data = await res.json();
      const finished = [...next, { role: 'assistant', content: data.reply || "I'm here with you. Let's take this one step at a time." } as Message];
      setMessages(finished); saveSession(finished);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: "I couldn't reach NJACP right now. Please try again in a moment." }]);
    } finally { setLoading(false); }
  }

  function submit(e: FormEvent) { e.preventDefault(); void sendMessage(); }
  function newChat() { setMessages(initial); setInput(''); setHistoryOpen(false); }
  function startFocus() { setRunning(true); void sendMessage(`I want to study for ${minutes} minutes. My energy is ${energy}/10. Give me a very small focus plan.`); }

  return (
    <main className="min-h-screen grid-bg text-slate-900">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#12395b] text-white shadow-lg"><HeartHandshake size={21} /></div>
          <div><b className="tracking-tight">NJACP</b><p className="text-xs text-slate-400">Your non-judgmental StudyFlow companion</p></div>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard" className="hidden rounded-xl border bg-white px-3 py-2 text-sm font-bold text-slate-600 sm:block">Dashboard</Link>
          <button onClick={() => setHistoryOpen(v => !v)} className="rounded-xl border bg-white px-3 py-2 text-sm font-bold text-slate-600"><History size={16} className="inline mr-1" /> History</button>
          <button onClick={newChat} className="rounded-xl bg-[#12395b] px-3 py-2 text-sm font-bold text-white"><Plus size={16} className="inline mr-1" /> New chat</button>
        </div>
      </header>

      {historyOpen && <aside className="fixed right-4 top-20 z-30 w-[min(340px,calc(100vw-2rem))] rounded-2xl border bg-white p-4 shadow-2xl"><div className="mb-3 flex justify-between font-bold">Recent conversations <button onClick={() => setHistoryOpen(false)}><X size={17}/></button></div>{sessions.length ? sessions.map(s => <button key={s.id} onClick={() => {setMessages(s.messages);setHistoryOpen(false)}} className="mb-2 w-full rounded-xl bg-slate-50 p-3 text-left text-sm hover:bg-slate-100">{s.title}</button>) : <p className="text-sm text-slate-400">Your recent conversations are stored locally on this device.</p>}</aside>}

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-8 lg:grid-cols-[0.82fr_1.45fr_0.73fr] lg:px-6">
        <div className="card rounded-3xl p-7">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1769e0]"><Sparkles size={16}/> A place to think out loud.</div>
          <h1 className="mt-3 text-4xl font-black leading-tight">You don’t have to carry it all alone.</h1>
          <p className="mt-4 leading-7 text-slate-600">Talk about school pressure, failure, procrastination, a difficult day, or whatever is on your mind. NJACP listens first, then helps you find the next step.</p>
          <div className="mt-7 grid gap-2">{starters.map(s => <button key={s} onClick={() => void sendMessage(s)} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left text-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm">{s}</button>)}</div>
          <div className="mt-7 rounded-2xl bg-blue-50 p-4"><div className="font-semibold">How NJACP works</div><div className="mt-2 text-sm leading-6 text-slate-600">Listen → understand → choose what you need → take one manageable step.</div></div>
          <Link href="/library" className="mt-4 flex items-center gap-2 rounded-2xl border bg-white p-4 text-sm font-bold text-slate-700 hover:border-blue-200"><Brain size={18} className="text-[#1769e0]"/>Need study material? Open Study Library →</Link>
        </div>

        <div className="overflow-hidden rounded-3xl border bg-white shadow-xl">
          <div className="flex items-center justify-between border-b px-5 py-4"><div><div className="font-bold">Your private conversation</div><div className="text-xs text-slate-400">Supportive · student-first · no lectures</div></div><div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_#dcfce7]"/></div>
          <div className="h-[600px] space-y-4 overflow-y-auto p-5">{messages.map((m, i) => <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${m.role === 'user' ? 'bg-[#1769e0] text-white' : 'bg-slate-100 text-slate-700'}`}>{m.content}</div></div>)}{loading && <div className="w-fit rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-400">NJACP is thinking…</div>}</div>
          <form onSubmit={submit} className="flex gap-2 border-t p-4"><input value={input} onChange={e => setInput(e.target.value)} placeholder="Tell NJACP what’s on your mind…" className="min-w-0 flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"/><button disabled={loading} className="rounded-2xl bg-[#1769e0] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"><Send size={16}/></button></form>
        </div>

        <div className="space-y-5">
          <div className="card rounded-3xl p-5"><div className="flex items-center gap-2 text-sm font-bold"><Clock3 size={17} className="text-[#1769e0]"/> Focus session</div><p className="mt-1 text-xs leading-5 text-slate-500">Tell NJACP your energy. It keeps the plan realistic.</p><label className="mt-5 block text-xs font-semibold text-slate-500">Energy: {energy}/10</label><input type="range" min="1" max="10" value={energy} onChange={e => setEnergy(+e.target.value)} className="mt-2 w-full"/><div className="mt-4 flex gap-2">{[15,25,45].map(n => <button key={n} onClick={() => {setMinutes(n);setSeconds(0)}} className={`flex-1 rounded-xl border py-2 text-xs font-semibold ${minutes === n ? 'border-blue-500 bg-blue-50 text-blue-700' : 'bg-white'}`}>{n}m</button>)}</div><div className="mt-5 text-center text-4xl font-black tabular-nums">{timeLabel}</div><button onClick={() => running ? setRunning(false) : startFocus()} className="mt-3 w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white">{running ? 'Pause focus' : 'Start with NJACP'}</button></div>
          <div className="card rounded-3xl p-5"><div className="flex items-center gap-2 text-sm font-bold"><Target size={17} className="text-[#1769e0]"/> Today</div><div className="mt-3 grid grid-cols-3 gap-2 text-center"><div className="rounded-xl bg-slate-50 p-3"><div className="text-xl font-black">{messages.filter(m => m.role === 'user').length}</div><div className="text-[10px] text-slate-400">messages</div></div><div className="rounded-xl bg-slate-50 p-3"><div className="text-xl font-black">{energy}</div><div className="text-[10px] text-slate-400">energy</div></div><div className="rounded-xl bg-slate-50 p-3"><div className="text-xl font-black">{minutes}</div><div className="text-[10px] text-slate-400">focus min</div></div></div></div>
          <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 text-xs leading-5 text-amber-800">NJACP is an AI companion, not a replacement for a trusted person or professional help. If you may be in immediate danger, seek human help now.</div>
        </div>
      </section>
    </main>
  );
}
