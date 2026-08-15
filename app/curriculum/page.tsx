'use client';

import { useMemo, useState } from 'react';
import { BookOpen, ExternalLink, GraduationCap, Target } from 'lucide-react';
import { chapters, competitiveTracks, officialSources, schoolSubjects } from '@/data/curriculum';

export default function CurriculumPage() {
  const [track, setTrack] = useState<'NCERT' | 'JEE Main' | 'NEET UG'>('NCERT');
  const [classNo, setClassNo] = useState('12');
  const [subject, setSubject] = useState('Physics');

  const subjects = track === 'NCERT' ? (schoolSubjects[classNo] || []) : competitiveTracks[track].subjects;
  const selectedSubject = subjects.includes(subject) ? subject : subjects[0] || '';
  const topicList = useMemo(() => chapters[classNo]?.[selectedSubject] || [], [classNo, selectedSubject]);

  return (
    <main className="min-h-screen grid-bg px-5 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#102a43] text-white"><GraduationCap/></div><div><b className="text-xl">StudyFlow</b><p className="text-xs text-slate-400">Curriculum & exam preparation</p></div></div><a href="/" className="text-sm font-bold text-[#1769e0]">Back to dashboard</a></header>

        <section className="mt-8 rounded-3xl bg-[#102a43] p-7 text-white lg:p-9"><p className="text-xs font-bold uppercase tracking-[.2em] text-blue-200">Official-source learning</p><h1 className="mt-3 text-3xl font-black sm:text-4xl">NCERT → JEE Main / NEET UG</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-blue-100/80">Choose a class and subject to work chapter by chapter. StudyFlow uses official NCERT and NTA sources as the curriculum reference, while AI-generated practice is original.</p></section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="grid gap-3 md:grid-cols-3"><select value={track} onChange={e=>setTrack(e.target.value as any)} className="rounded-xl border border-slate-200 p-3 text-sm font-semibold"><option>NCERT</option><option>JEE Main</option><option>NEET UG</option></select><select value={classNo} onChange={e=>setClassNo(e.target.value)} className="rounded-xl border border-slate-200 p-3 text-sm font-semibold">{Object.keys(schoolSubjects).map(c=><option key={c} value={c}>Class {c}</option>)}</select><select value={selectedSubject} onChange={e=>setSubject(e.target.value)} className="rounded-xl border border-slate-200 p-3 text-sm font-semibold">{subjects.map(s=><option key={s}>{s}</option>)}</select></div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]"><div><div className="flex items-center gap-2"><BookOpen className="text-[#1769e0]" size={19}/><h2 className="text-lg font-extrabold">{selectedSubject || 'Subject'} chapters</h2></div>{topicList.length ? <div className="mt-4 grid gap-2 sm:grid-cols-2">{topicList.map((topic,i)=><a key={topic} href={`/practice?class=${classNo}&subject=${encodeURIComponent(selectedSubject)}&topic=${encodeURIComponent(topic)}`} className="rounded-xl border border-slate-100 p-4 hover:border-blue-200 hover:bg-blue-50/30"><span className="text-xs font-bold text-slate-400">{String(i+1).padStart(2,'0')}</span><b className="mt-1 block text-sm">{topic}</b><span className="mt-2 block text-xs font-semibold text-[#1769e0]">Open practice →</span></a>)}</div> : <div className="mt-4 rounded-2xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">This class/subject is intentionally linked to the official NCERT catalog instead of inventing chapter data. Open the official textbook portal to select the current edition.</div>}</div>

            <aside className="rounded-2xl bg-slate-50 p-5"><div className="flex items-center gap-2"><Target size={17} className="text-[#1769e0]"/><b className="text-sm">Official sources</b></div><div className="mt-4 space-y-2 text-xs font-semibold"><a className="flex items-center justify-between rounded-lg bg-white p-3 hover:bg-blue-50" href={officialSources.ncertTextbooks} target="_blank">NCERT Textbooks <ExternalLink size={13}/></a><a className="flex items-center justify-between rounded-lg bg-white p-3 hover:bg-blue-50" href={track==='JEE Main'?officialSources.jeeSyllabus:track==='NEET UG'?officialSources.neetHome:officialSources.ncertBooks} target="_blank">{track==='NCERT'?'NCERT Books':`${track} official site`} <ExternalLink size={13}/></a></div><p className="mt-4 text-[11px] leading-5 text-slate-400">Official pages are the source of truth for current editions, syllabus changes and examination notices.</p></aside>
          </div>
        </section>
      </div>
    </main>
  );
}
