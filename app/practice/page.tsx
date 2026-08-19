'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, GraduationCap, RotateCcw, Target } from 'lucide-react';
import { chapters, competitiveTracks, schoolSubjects } from '../../data/curriculum';

const tracks = ['NCERT', 'JEE Main', 'NEET UG'] as const;
const classes = Object.keys(schoolSubjects);

export default function PracticePage() {
  const [classNo, setClassNo] = useState('12');
  const [subject, setSubject] = useState('Physics');
  const [topic, setTopic] = useState('Current Electricity');
  const [track, setTrack] = useState<(typeof tracks)[number]>('NCERT');
  const [level, setLevel] = useState('Exam');
  const [questions, setQuestions] = useState<any[]>([]);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subjects = useMemo(() => {
    if (track === 'NCERT') return schoolSubjects[classNo] || [];
    return [...competitiveTracks[track].subjects];
  }, [classNo, track]);

  const topics = useMemo(() => {
    if (track !== 'NCERT') return chapters[classNo]?.[subject] || [];
    return chapters[classNo]?.[subject] || [];
  }, [classNo, subject, track]);

  const score = useMemo(
    () => questions.reduce((n, q, i) => n + (selected[i] === String(q.answer).trim().charAt(0).toUpperCase() ? 1 : 0), 0),
    [questions, selected],
  );

  async function generate() {
    setLoading(true);
    setError('');
    setQuestions([]);
    setSelected({});
    setSubmitted(false);
    try {
      const r = await fetch('/api/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classNo,
          subject,
          topic,
          chapter: topic,
          track,
          level,
          count: 10,
          requestId: `${classNo}-${subject}-${topic}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error || 'Unable to generate questions');
      setQuestions(d.questions || []);
    } catch (e: any) {
      setError(e.message || 'Unable to generate questions');
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    setSubmitted(true);
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const answer = String(q.answer || '').trim().charAt(0).toUpperCase();
      if (!selected[i]) continue;
      await fetch('/api/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track, classNo, subject, chapter: topic, topic, question: q.question, studentAnswer: selected[i], correctAnswer: answer, isCorrect: selected[i] === answer, difficulty: q.difficulty }),
      });
    }
  }

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const urlClass = p.get('class') || '12';
    const urlTrack = (p.get('track') || 'NCERT') as (typeof tracks)[number];
    const urlSubject = p.get('subject') || '';
    const urlTopic = p.get('chapter') || p.get('topic') || '';
    setClassNo(classes.includes(urlClass) ? urlClass : '12');
    setTrack(tracks.includes(urlTrack) ? urlTrack : 'NCERT');
    if (urlSubject) setSubject(urlSubject);
    if (urlTopic) setTopic(urlTopic);
  }, []);

  useEffect(() => {
    if (!subjects.length) return;
    if (!subjects.includes(subject)) setSubject(subjects[0]);
  }, [subjects, subject]);

  useEffect(() => {
    if (!topics.length) return;
    if (!topics.includes(topic)) setTopic(topics[0]);
  }, [topics, topic]);

  useEffect(() => {
    if (classNo && subject && topic) generate();
    // Initial URL selection and selector changes should generate a fresh set.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classNo, subject, topic, track]);

  return (
    <main className="min-h-screen bg-[#f5f7fa] px-5 py-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#102a43] text-white"><GraduationCap /></div>
            <div><b className="text-xl">StudyFlow Practice</b><p className="text-xs text-slate-400">Objective MCQs • {subject} • {topic} • Class {classNo} • {track}</p></div>
          </div>
          <a href="/dashboard" className="text-sm font-bold text-[#1769e0]">← Dashboard</a>
        </header>

        <section className="mt-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Track<select value={track} onChange={e => setTrack(e.target.value as any)} className="mt-2 block w-full rounded-xl border border-slate-200 p-3 text-sm">{tracks.map(x => <option key={x}>{x}</option>)}</select></label>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Class<select value={classNo} onChange={e => setClassNo(e.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 p-3 text-sm">{classes.map(x => <option key={x}>{x}</option>)}</select></label>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Subject<select value={subject} onChange={e => setSubject(e.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 p-3 text-sm">{subjects.map(x => <option key={x}>{x}</option>)}</select></label>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 sm:col-span-2 lg:col-span-1">Chapter/topic<select value={topic} onChange={e => setTopic(e.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 p-3 text-sm">{topics.length ? topics.map(x => <option key={x}>{x}</option>) : <option>General practice</option>}</select></label>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Difficulty<select value={level} onChange={e => setLevel(e.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 p-3 text-sm"><option>Basic</option><option>Application</option><option>Exam</option><option>JEE / NEET</option></select></label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button onClick={generate} disabled={loading} className="btn-primary rounded-xl px-5 py-3 text-sm font-bold disabled:opacity-50">{loading ? 'Generating…' : 'Generate fresh objective set'}</button>
            <span className="text-xs text-slate-400">10 single-correct MCQs • answers revealed after submission</span>
          </div>
        </section>

        {error && <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        {questions.length > 0 && <section className="mt-6 space-y-4">
          {questions.map((q, i) => {
            const answer = String(q.answer || '').trim().charAt(0).toUpperCase();
            return <article key={q.id || i} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4"><div><span className="text-xs font-bold text-slate-400">QUESTION {i + 1} • OBJECTIVE MCQ</span><h2 className="mt-2 text-base font-bold leading-6">{q.question}</h2></div><span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-700">{q.difficulty || level}</span></div>
              <div className="mt-5 grid gap-2">{(q.options || []).map((o: string, j: number) => { const letter = String.fromCharCode(65 + j); return <button key={j} onClick={() => !submitted && setSelected({ ...selected, [i]: letter })} className={`rounded-xl border p-3 text-left text-sm ${selected[i] === letter ? 'border-blue-400 bg-blue-50' : ''} ${submitted && answer === letter ? 'border-emerald-400 bg-emerald-50' : ''}`}>{letter}. {o}</button>; })}</div>
              {submitted && <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6"><b>{selected[i] === answer ? 'Correct' : 'Review this one'}</b><p className="mt-1 text-slate-600">Correct answer: {answer}. {q.explanation}</p></div>}
            </article>;
          })}
        </section>}

        {questions.length > 0 && <div className="sticky bottom-4 mt-6 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur"><div className="text-sm font-bold">{submitted ? <><CheckCircle2 className="mr-1 inline text-emerald-600" /> Score: {score}/{questions.length}</> : 'Choose an answer for each question.'}</div>{!submitted ? <button onClick={submit} className="btn-primary rounded-xl px-5 py-3 text-sm font-bold">Submit test</button> : <button onClick={generate} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold"><RotateCcw size={15} className="mr-2 inline" />New fresh set</button>}</div>}

        <div className="mt-8 rounded-2xl bg-[#102a43] p-5 text-sm leading-6 text-blue-100"><Target size={18} className="mb-2" /><b>StudyFlow:</b> every set is generated for the selected class, subject, chapter and track. The questions are objective MCQs, and the correct answer plus explanation appears after submission.</div>
      </div>
    </main>
  );
}
