import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { classNo = '12', subject = 'Physics', topic = 'Current Electricity', level = 'Exam', count = 10, track = 'NCERT' } = await req.json();
    const token = process.env.HF_TOKEN;
    if (!token) return NextResponse.json({ error: 'Configure HF_TOKEN in Vercel to generate live questions.' }, { status: 503 });

    const model = process.env.HF_MODEL || 'Qwen/Qwen2.5-7B-Instruct:fastest';
    const competitive = track === 'JEE Main' || track === 'NEET UG' || level === 'JEE / NEET';
    const examInstruction = competitive
      ? `Create original ${track === 'NEET UG' ? 'NEET UG' : 'JEE Main'}-style practice. For NEET use four-option single-correct MCQs and biology/physics/chemistry reasoning as appropriate. For JEE Main use exam-style conceptual/numerical questions; use four options for MCQs. Do not reproduce copyrighted coaching or past-paper wording.`
      : `Create original Class ${classNo} school practice at ${level} difficulty aligned to the selected topic.`;

    const system = `You are StudyFlow Practice Engine. Generate accurate Indian curriculum practice questions. ${examInstruction}
Return ONLY valid JSON with this exact shape: {"questions":[{"question":"...","options":["A","B","C","D"],"answer":"A","explanation":"...","difficulty":"Easy|Medium|Hard"}]}. Never include markdown fences. Do not claim any question is guaranteed to appear in an exam.`;
    const user = `Class: ${classNo}. Subject: ${subject}. Topic/chapter: ${topic}. Track: ${track}. Difficulty: ${level}. Generate exactly ${Math.min(Math.max(Number(count) || 10, 1), 20)} questions.`;

    const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: system }, { role: 'user', content: user }], temperature: 0.3, max_tokens: 2600 }),
      cache: 'no-store',
    });

    const raw = await response.text();
    let data: any = null;
    try { data = JSON.parse(raw); } catch {}
    if (!response.ok) {
      const message = data?.error?.message || data?.error || data?.message || raw;
      return NextResponse.json({ error: `Hugging Face returned ${response.status}: ${String(message).slice(0, 700)}` }, { status: 502 });
    }

    const content = data?.choices?.[0]?.message?.content;
    if (!content) return NextResponse.json({ error: 'The AI provider returned no questions.' }, { status: 502 });

    const cleaned = String(content).replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      if (start >= 0 && end > start) parsed = JSON.parse(cleaned.slice(start, end + 1));
    }
    if (!parsed?.questions || !Array.isArray(parsed.questions)) return NextResponse.json({ error: 'The generated set was not valid JSON. Please try again.' }, { status: 502 });
    return NextResponse.json({ questions: parsed.questions.slice(0, 20), track, classNo, subject, topic });
  } catch (error) {
    console.error('StudyFlow practice error:', error);
    return NextResponse.json({ error: 'Practice generation failed. Check the Vercel deployment logs.' }, { status: 500 });
  }
}
