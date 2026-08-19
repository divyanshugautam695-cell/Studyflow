import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function cleanQuestion(q: any, index: number) {
  const options = Array.isArray(q?.options) ? q.options.map((x: any) => String(x).trim()).filter(Boolean).slice(0, 4) : [];
  const answerRaw = String(q?.answer ?? '').trim().toUpperCase();
  const answer = /^[A-D]$/.test(answerRaw)
    ? answerRaw
    : options.findIndex((x: string) => x.toLowerCase() === answerRaw.toLowerCase()) >= 0
      ? String.fromCharCode(65 + options.findIndex((x: string) => x.toLowerCase() === answerRaw.toLowerCase()))
      : '';

  if (!q?.question || options.length !== 4 || !answer) return null;
  if (new Set(options.map((x: string) => x.toLowerCase())).size !== 4) return null;

  return {
    id: String(q.id || `q${index + 1}`),
    question: String(q.question).trim(),
    options,
    answer,
    explanation: String(q.explanation || 'The correct option follows from the stated concept and conditions.').trim(),
    difficulty: ['Easy', 'Medium', 'Hard'].includes(String(q.difficulty)) ? String(q.difficulty) : 'Medium',
    type: 'objective_mcq',
  };
}

export async function POST(req: Request) {
  try {
    const {
      classNo = '12',
      subject = 'Physics',
      topic = 'Current Electricity',
      level = 'Exam',
      count = 10,
      track = 'NCERT',
      requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    } = await req.json();

    const token = process.env.HF_TOKEN;
    if (!token) return NextResponse.json({ error: 'Configure HF_TOKEN in Vercel to generate live questions.' }, { status: 503 });

    const safeClass = String(classNo).trim();
    const safeSubject = String(subject).trim();
    const safeTopic = String(topic).trim();
    const safeTrack = String(track).trim();
    const safeLevel = String(level).trim();
    const total = Math.min(Math.max(Number(count) || 10, 1), 20);
    const model = process.env.HF_MODEL || 'Qwen/Qwen2.5-7B-Instruct:fastest';
    const competitive = safeTrack === 'JEE Main' || safeTrack === 'NEET UG' || safeLevel === 'JEE / NEET';

    const subjectInstruction =
      safeSubject === 'Physics' ? 'Use physics laws, concepts, units, equations and numerical reasoning where appropriate.' :
      safeSubject === 'Chemistry' ? 'Use chemistry concepts, reactions, periodic trends, structures, equations and calculations where appropriate.' :
      safeSubject === 'Mathematics' ? 'Use mathematical reasoning, formulas and calculations. Make numerical answers exact unless the question explicitly requires approximation.' :
      safeSubject === 'Biology' ? 'Use biology concepts, terminology, processes and NCERT-aligned factual reasoning.' :
      safeSubject === 'Science' ? 'Keep the question strictly within the selected school Science topic and age-appropriate scientific concepts.' :
      safeSubject === 'Social Science' ? 'Use history, geography, civics or economics only when supported by the selected topic.' :
      `Keep every question strictly within ${safeSubject} and the selected topic.`;

    const examInstruction = competitive
      ? `Create original ${safeTrack === 'NEET UG' ? 'NEET UG' : 'JEE Main'}-style practice. Use objective single-correct MCQs with four options. ${subjectInstruction} Do not reproduce copyrighted coaching or past-paper wording.`
      : `Create original Class ${safeClass} school practice at ${safeLevel} difficulty aligned strictly to ${safeSubject} and the selected chapter/topic. ${subjectInstruction}`;

    const system = `You are StudyFlow Practice Engine, an objective-question generator for Indian school and competitive exam preparation.
${examInstruction}
Every question MUST be a standalone objective single-correct multiple-choice question with exactly four plausible options A-D and exactly one correct answer.
The class, subject, topic and track are hard constraints. Never substitute a different class, subject, chapter or generic topic.
Vary concepts, numerical values, wording and distractors across the set. Never repeat the same question or merely change the scenario.
For school questions, stay appropriate to the requested class level. For NCERT, stay aligned with the selected topic and established NCERT-level concepts without inventing textbook quotations.
Return ONLY valid JSON in this exact shape: {"questions":[{"id":"q1","question":"...","options":["...","...","...","..."],"answer":"A","explanation":"...","difficulty":"Easy|Medium|Hard"}]}. No markdown fences, no extra text.
The answer field must be exactly A, B, C or D. Explanations must state why the correct option is correct. Never claim a question is guaranteed to appear in an exam.`;

    const user = `Unique generation request: ${String(requestId)}
Class: ${safeClass}
Subject: ${safeSubject}
Chapter/topic: ${safeTopic}
Track: ${safeTrack}
Difficulty: ${safeLevel}
Generate exactly ${total} fresh objective MCQs. Make this set materially different from any previous set, even if the same class, subject and topic are requested again.`;

    const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
        temperature: 0.8,
        top_p: 0.9,
        max_tokens: Math.max(2600, total * 350),
      }),
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

    if (!parsed?.questions || !Array.isArray(parsed.questions)) {
      return NextResponse.json({ error: 'The generated set was not valid JSON. Please try again.' }, { status: 502 });
    }

    const questions = parsed.questions.map(cleanQuestion).filter(Boolean).slice(0, total);
    if (questions.length < Math.min(3, total)) {
      return NextResponse.json({ error: 'The AI generated too few valid objective questions. Please generate a new set.' }, { status: 502 });
    }

    return NextResponse.json({ questions, track: safeTrack, classNo: safeClass, subject: safeSubject, topic: safeTopic, requestId });
  } catch (error) {
    console.error('StudyFlow practice error:', error);
    return NextResponse.json({ error: 'Practice generation failed. Check the Vercel deployment logs.' }, { status: 500 });
  }
}
