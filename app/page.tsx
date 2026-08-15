'use client';

import { useState } from 'react';
import {
  ArrowRight, BarChart3, BookOpen, Brain, CalendarDays, CheckCircle2,
  ChevronRight, Clock3, Flame, GraduationCap, LayoutDashboard, Menu,
  MessageCircle, Play, Plus, Search, Sparkles, Target, Trophy, X,
} from 'lucide-react';

const topics = [
  { name: 'Current Electricity', subject: 'Physics', mastery: 43, priority: 'Critical', color: 'bg-rose-500', icon: '⚡' },
  { name: 'Electrostatics', subject: 'Physics', mastery: 67, priority: 'High', color: 'bg-amber-500', icon: '◉' },
  { name: 'Integration', subject: 'Mathematics', mastery: 72, priority: 'High', color: 'bg-violet-500', icon: '∫' },
  { name: 'Chemical Bonding', subject: 'Chemistry', mastery: 88, priority: 'Good', color: 'bg-emerald-500', icon: '⚗' },
];

const nav = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'AI Tutor', icon: MessageCircle },
  { label: 'Practice', icon: Target },
  { label: 'My Subjects', icon: BookOpen },
  { label: 'Tests', icon: Trophy },
  { label: 'Progress', icon: BarChart3 },
];

export default function Home() {
  const [active, setActive] = useState('Dashboard');
  const [quickTime, setQuickTime] = useState(30);
  const [question, setQuestion] = useState('');
  const [asked, setAsked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const ask = () => { if (question.trim()) setAsked(true); };

  return (
    <main className="min-h-screen grid-bg">
      <div className="flex min-h-screen">
        <aside className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0`}>
          <div className="flex h-full flex-col px-5 py-6">
            <div className="mb-8 flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg"><Sparkles size={19}/></div>
                <div><div className="text-lg font-black tracking-tight">StudyFlow</div><div className="text-[10px] font-bold uppercase tracking-[.2em] text-slate-400">AI Learning</div></div>
              </div>
              <button className="lg:hidden" onClick={() => setMobileOpen(false)}><X size={20}/></button>
            </div>
            <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Workspace</div>
            <nav className="space-y-1">
              {nav.map(({label, icon: Icon}) => <button key={label} onClick={() => {setActive(label); setMobileOpen(false)}} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${active === label ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/10' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><Icon size={18}/>{label}{label === 'Practice' && <span className="ml-auto rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">New</span>}</button>)}
            </nav>
            <div className="mt-auto rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-4 text-white shadow-xl shadow-indigo-500/20">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"><Brain size={18}/></div>
              <div className="text-sm font-bold">Your AI tutor is ready</div>
              <p className="mt-1 text-xs leading-5 text-indigo-100">Ask anything, upload a question, or start a focused practice session.</p>
              <button onClick={() => setActive('AI Tutor')} className="mt-4 flex items-center gap-1 text-xs font-bold">Open tutor <ArrowRight size={13}/></button>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/80 px-5 backdrop-blur-xl lg:px-10">
            <div className="flex items-center gap-3"><button className="rounded-xl p-2 hover:bg-slate-100 lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={20}/></button><div><p className="text-xs font-semibold text-slate-400">Saturday, August 15</p><h1 className="text-xl font-extrabold tracking-tight">Good morning, Student 👋</h1></div></div>
            <div className="hidden items-center gap-3 sm:flex"><button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm"><Search size={16}/> Search</button><div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-black text-white">S</div></div>
          </header>

          <div className="mx-auto max-w-[1500px] space-y-6 p-5 lg:p-10">
            <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
              <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-2xl shadow-slate-900/10 lg:p-9">
                <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-violet-500/25 blur-3xl"/><div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl"/>
                <div className="relative max-w-2xl"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-indigo-100"><Sparkles size={13}/> Adaptive learning engine</div><h2 className="text-3xl font-black tracking-tight sm:text-4xl">Study smarter.<br/><span className="text-indigo-300">Flow with your progress.</span></h2><p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">StudyFlow analyzes your syllabus, mistakes and practice history to decide what you should learn next — not just what you can study.</p><div className="mt-7 flex flex-wrap gap-3"><button onClick={() => setActive('Practice')} className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 shadow-lg">Continue learning <ArrowRight size={16}/></button><button onClick={() => setActive('AI Tutor')} className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-white">Ask AI Tutor</button></div></div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Exam readiness</p><p className="mt-1 text-2xl font-black">78%</p></div><div className="relative flex h-20 w-20 items-center justify-center"><div className="ring-gradient absolute inset-0 rounded-full"/><div className="relative z-10 text-sm font-black">Good</div></div></div><div className="mt-5 space-y-3"><Metric label="Syllabus coverage" value={91}/><Metric label="Concept mastery" value={73}/><Metric label="Practice strength" value={69}/></div><button className="mt-5 flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-100">View full readiness report <ChevronRight size={15}/></button></div>
            </div>

            <div className="grid gap-5 md:grid-cols-3"><Stat icon={<Flame size={18}/>} label="Study streak" value="12 days" note="Personal best: 18"/><Stat icon={<Clock3 size={18}/>} label="This week" value="8h 42m" note="+18% vs last week"/><Stat icon={<CheckCircle2 size={18}/>} label="Questions solved" value="184" note="76% accuracy"/></div>

            <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft"><div className="flex items-start justify-between"><div><div className="flex items-center gap-2"><Target size={18} className="text-violet-600"/><h3 className="text-lg font-extrabold">Priority topics</h3></div><p className="mt-1 text-sm text-slate-500">Topics where your next hour has the highest learning value.</p></div><button className="text-xs font-bold text-violet-600">See all</button></div><div className="mt-6 space-y-3">{topics.map(t => <button key={t.name} onClick={() => setActive('Practice')} className="group flex w-full items-center gap-4 rounded-2xl border border-slate-100 p-3 text-left transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-lg">{t.icon}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="truncate text-sm font-bold">{t.name}</p><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${t.priority === 'Critical' ? 'bg-rose-50 text-rose-600' : t.priority === 'High' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{t.priority}</span></div><div className="mt-2 flex items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${t.color}`} style={{width:`${t.mastery}%`}}/></div><span className="text-[11px] font-bold text-slate-400">{t.mastery}%</span></div></div><ChevronRight size={16} className="text-slate-300 transition group-hover:text-violet-500"/></button>)}</div></section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft"><div className="flex items-center gap-2"><Clock3 size={18} className="text-cyan-600"/><h3 className="text-lg font-extrabold">I have time to study</h3></div><p className="mt-1 text-sm text-slate-500">Let AI build the highest-impact session for you.</p><div className="mt-5 grid grid-cols-3 gap-2">{[15,30,60].map(n => <button key={n} onClick={() => setQuickTime(n)} className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${quickTime===n ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>{n} min</button>)}</div><div className="mt-5 rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Recommended mission</p><div className="mt-3 space-y-3"><Plan icon="📖" title="Revise Kirchhoff's laws" time={`${Math.round(quickTime*.4)} min`} /><Plan icon="🧮" title="Application practice" time={`${Math.round(quickTime*.45)} min`} /><Plan icon="🧠" title="Active recall" time={`${Math.max(2,Math.round(quickTime*.15))} min`} /></div></div><button onClick={() => setActive('Practice')} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-sm font-bold text-white shadow-lg">Start {quickTime}-minute session <Play size={15} fill="currentColor"/></button></section>
            </div>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2"><MessageCircle size={18} className="text-violet-600"/><h3 className="text-lg font-extrabold">Ask StudyFlow AI</h3></div><p className="mt-1 text-sm text-slate-500">Explain, solve, quiz me, or help me plan my preparation.</p></div><div className="flex items-center gap-2 text-xs font-semibold text-emerald-600"><span className="h-2 w-2 rounded-full bg-emerald-500"/> AI Tutor online</div></div><div className="mt-5 flex flex-col gap-3 sm:flex-row"><input value={question} onChange={e => {setQuestion(e.target.value); setAsked(false)}} onKeyDown={e => e.key==='Enter' && ask()} placeholder="e.g. Explain Kirchhoff's laws with an example…" className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"/><button onClick={ask} className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20"><Sparkles size={16}/> Ask AI</button></div>{asked && <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50 p-4 text-sm leading-6 text-slate-700 fade-up"><span className="font-bold text-violet-700">StudyFlow AI:</span> Great question. I’ll explain it step-by-step, then give you a similar problem to solve so we can check your understanding. <span className="font-semibold">Your question:</span> “{question}”</div>}</section>

            <footer className="flex flex-col gap-2 border-t border-slate-200 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2"><GraduationCap size={15}/> StudyFlow AI • Adaptive learning platform</div><div>Built for learning, not shortcutting.</div></footer>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({label, value}:{label:string;value:number}) { return <div><div className="mb-1 flex justify-between text-[11px] font-semibold text-slate-500"><span>{label}</span><span>{value}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-violet-500" style={{width:`${value}%`}}/></div></div> }
function Stat({icon,label,value,note}:{icon:React.ReactNode;label:string;value:string;note:string}) { return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">{icon}</div><span className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</span></div><div className="mt-3 text-2xl font-black tracking-tight">{value}</div><p className="mt-1 text-xs font-semibold text-slate-400">{note}</p></div> }
function Plan({icon,title,time}:{icon:string;title:string;time:string}) { return <div className="flex items-center gap-3"><span className="text-base">{icon}</span><span className="flex-1 text-xs font-bold text-slate-700">{title}</span><span className="text-[10px] font-bold text-slate-400">{time}</span></div> }
