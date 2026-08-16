import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { libraryCatalog } from '@/lib/library/catalog';

type SearchParams = Record<string, string | string[] | undefined>;

function firstParam(value: string | string[] | undefined, fallback: string) {
  return Array.isArray(value) ? (value[0] ?? fallback) : (value ?? fallback);
}

export default function LibraryChaptersPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const cls = firstParam(searchParams?.class, '12');
  const subjects = libraryCatalog[cls] || libraryCatalog['12'];

  return (
    <main className="min-h-screen bg-[#f4f5f7] grid-bg px-5 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="app-gradient rounded-[2rem] p-7 text-white shadow-xl">
          <p className="text-sm font-semibold text-blue-100">StudyFlow · Study Library</p>
          <h1 className="mt-2 text-3xl font-black">Class {cls} learning hub</h1>
          <p className="mt-3 max-w-2xl text-blue-100">
            Choose a subject, then a chapter. Every chapter connects to official NCERT resources, your AI tutor and targeted practice.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <section key={subject.name} className="card rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl font-black text-blue-600">
                  {subject.icon}
                </div>
                <h2 className="text-xl font-black text-slate-900">{subject.name}</h2>
              </div>
              <div className="mt-5 space-y-2">
                {subject.chapters.map((chapter, index) => (
                  <Link
                    key={chapter.title}
                    href={`/library/topic?class=${encodeURIComponent(cls)}&subject=${encodeURIComponent(subject.name)}&chapter=${encodeURIComponent(chapter.title)}`}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    <span>
                      <span className="mr-2 text-xs text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                      {chapter.title}
                    </span>
                    <ChevronRight size={16} className="text-slate-400" />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Link href="/library" className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white">Back to library</Link>
          <Link href="/dashboard" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700">Dashboard</Link>
        </div>
      </div>
    </main>
  );
}
