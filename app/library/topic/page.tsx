'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, BookOpen, Brain, Camera, ExternalLink, Mic, Target } from 'lucide-react';

function LibraryTopicContent() {
  const params = useSearchParams();
  const cls = params.get('class') || '12';
  const subject = params.get('subject') || 'Physics';
  const chapter = params.get('chapter') || 'Chapter';
  const practice = `/practice?class=${encodeURIComponent(cls)}&subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(chapter)}`;
  const tutor = `/tutor?class=${encodeURIComponent(cls)}&subject=${encodeURIComponent(subject)}&chapter=${encodeURIComponent(chapter)}`;

  return (
    <main className="min-h-screen bg-[#f4f5f7] grid-bg px-5 py-8">
      <div className="mx-auto max-w-5xl">
        <Link href={`/library/chapters?class=${encodeURIComponent(cls)}`} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600"><ArrowLeft size={16}/> Class {cls} library</Link>
        <div className="mt-4 app-gradient rounded-[2rem] p-8 text-white shadow-xl">
          <p className="text-sm font-bold text-blue-100">Class {cls} · {subject}</p>
          <h1 className="mt-2 text-3xl font-black">{chapter}</h1>
          <p className="mt-3 max-w-2xl text-blue-100">Your chapter workspace — learn the NCERT concepts, ask StudyFlow AI, practice at the right level and track mastery.</p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <a href="https://ncert.nic.in/textbook.php" target="_blank" rel="noreferrer" className="card rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
            <BookOpen className="text-blue-600"/><h2 className="mt-3 text-xl font-black">Official NCERT</h2><p className="mt-1 text-sm text-slate-500">Open the official NCERT textbook portal for the relevant book.</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-600">Open NCERT <ExternalLink size={15}/></span>
          </a>
          <Link href={tutor} className="card rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-lg"><Brain className="text-blue-600"/><h2 className="mt-3 text-xl font-black">Ask StudyFlow AI</h2><p className="mt-1 text-sm text-slate-500">Explain {chapter} at your class level, step by step.</p><span className="mt-4 inline-flex text-sm font-bold text-blue-600">Open AI Tutor →</span></Link>
          <Link href={practice} className="card rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-lg"><Target className="text-blue-600"/><h2 className="mt-3 text-xl font-black">Practice this chapter</h2><p className="mt-1 text-sm text-slate-500">Start chapter-focused questions and build mastery.</p><span className="mt-4 inline-flex text-sm font-bold text-blue-600">Start practice →</span></Link>
          <div className="card rounded-2xl p-5"><div className="flex gap-3"><Camera className="text-blue-600"/><Mic className="text-blue-600"/></div><h2 className="mt-3 text-xl font-black">Doubt Solver</h2><p className="mt-1 text-sm text-slate-500">Use your existing photo and voice doubt tools with this chapter context.</p><div className="mt-4 flex gap-2"><Link href={`${tutor}&mode=photo`} className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white">Photo doubt</Link><Link href={`${tutor}&mode=voice`} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">Voice doubt</Link></div></div>
        </div>

        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5"><p className="text-sm leading-6 text-blue-900"><b>StudyFlow path:</b> Read the official chapter → ask the AI tutor about difficult concepts → practice → review mistakes → repeat until mastery improves.</p></div>
      </div>
    </main>
  );
}

export default function LibraryTopicPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f4f5f7] p-8"><div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-8 shadow-sm">Loading chapter…</div></main>}>
      <LibraryTopicContent />
    </Suspense>
  );
}
