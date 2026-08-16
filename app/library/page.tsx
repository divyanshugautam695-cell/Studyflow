'use client';

import { useMemo, useState } from 'react';
import { BookOpen, ExternalLink, Search, GraduationCap, Target, HeartPulse } from 'lucide-react';

const classes = ['6','7','8','9','10','11','12'];
const resources = [
  { title:'NCERT Textbooks', type:'Official', description:'Class 6–12 textbooks and chapters from NCERT.', tag:'NCERT', href:'https://ncert.nic.in/textbook.php', icon:BookOpen },
  { title:'ePathshala', type:'Official', description:'NCERT digital books and learning resources.', tag:'NCERT', href:'https://epathshala.nic.in/', icon:GraduationCap },
  { title:'NCERT Exemplar', type:'Official', description:'Higher-level practice material for school and competitive preparation.', tag:'Practice', href:'https://ncert.nic.in/exemplar-problems.php', icon:Target },
  { title:'JEE Preparation', type:'StudyFlow', description:'Use StudyFlow practice for JEE Main and Advanced-style preparation.', tag:'JEE', href:'/practice?track=JEE', icon:Target },
  { title:'NEET Preparation', type:'StudyFlow', description:'Biology, Physics and Chemistry practice for NEET preparation.', tag:'NEET', href:'/practice?track=NEET', icon:HeartPulse },
  { title:'H.C. Verma — Concepts of Physics', type:'Reference', description:'Use the official source for Concepts of Physics Vol. 1 & 2. StudyFlow does not redistribute copyrighted PDFs.', tag:'Class 11–12', href:'https://hcverma.in/books', icon:BookOpen },
];

export default function LibraryPage(){
 const [cls,setCls]=useState('12'); const [q,setQ]=useState('');
 const filtered=useMemo(()=>resources.filter(r=>`${r.title} ${r.description} ${r.tag}`.toLowerCase().includes(q.toLowerCase())),[q]);
 return <main className="min-h-screen bg-[#f4f5f7] grid-bg px-5 py-8">
  <div className="mx-auto max-w-6xl">
   <div className="app-gradient rounded-[2rem] p-7 sm:p-10 text-white shadow-xl">
    <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#102a43]"><GraduationCap/></div><div><p className="text-sm font-semibold text-blue-100">StudyFlow</p><h1 className="text-3xl font-black">Study Library</h1></div></div>
    <p className="mt-5 max-w-2xl text-blue-100">Find official NCERT books, digital learning resources, competitive preparation and trusted reference-book information — all connected to your StudyFlow learning journey.</p>
   </div>
   <div className="mt-6 card rounded-2xl p-5">
    <div className="flex flex-wrap gap-2">{classes.map(c=><button key={c} onClick={()=>setCls(c)} className={`rounded-xl px-4 py-2 text-sm font-bold ${cls===c?'bg-[#1769e0] text-white':'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Class {c}</button>)}<button onClick={()=>setCls('JEE')} className={`rounded-xl px-4 py-2 text-sm font-bold ${cls==='JEE'?'bg-[#1769e0] text-white':'bg-slate-100 text-slate-600'}`}>JEE</button><button onClick={()=>setCls('NEET')} className={`rounded-xl px-4 py-2 text-sm font-bold ${cls==='NEET'?'bg-[#1769e0] text-white':'bg-slate-100 text-slate-600'}`}>NEET</button></div>
    <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3"><Search size={18} className="text-slate-400"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search books, resources or exams..." className="w-full py-3 text-sm outline-none"/></div>
   </div>
   <div className="mt-7 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-blue-600">Class {cls}</p><h2 className="mt-1 text-2xl font-black text-slate-900">Recommended resources</h2></div><a href="/dashboard" className="text-sm font-bold text-blue-600">Back to dashboard</a></div>
   <div className="mt-5 grid gap-4 md:grid-cols-2">{filtered.map(r=>{const Icon=r.icon;return <article key={r.title} className="card rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-lg"><div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon size={21}/></div><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">{r.tag}</span><span className="text-xs font-semibold text-slate-400">{r.type}</span></div><h3 className="mt-2 text-lg font-black text-slate-900">{r.title}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{r.description}</p><a href={r.href} target={r.href.startsWith('http')?'_blank':undefined} rel={r.href.startsWith('http')?'noreferrer':undefined} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#1769e0] px-4 py-2.5 text-sm font-bold text-white">Open resource <ExternalLink size={15}/></a></div></div></article>})}</div>
   <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm leading-6 text-blue-900"><b>Copyright note:</b> StudyFlow links students to official/public resources and does not host or redistribute copyrighted commercial textbooks such as H.C. Verma PDFs.</div>
  </div>
 </main>
}
