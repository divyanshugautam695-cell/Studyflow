import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { classNo = '12', subject = 'Physics', topic = 'Current Electricity', level = 'Exam', count = 10 } = await req.json();
    const token = process.env.HF_TOKEN;
    if (!token) return NextResponse.json({ error: 'Configure HF_TOKEN to generate live questions.' }, { status: 503 });
    const model = process.env.HF_MODEL || 'Qwen/Qwen2.5-7B-Instruct';
    const levelInstruction = level === 'JEE / NEET'
      ? 'Use high-difficulty competitive-exam style questions. For Physics/Chemistry/Maths target JEE-style reasoning; for Biology target NEET-style MCQs. Do not reproduce copyrighted question-bank text.'
      : `Create ${level}-level school questions aligned to the topic.`;
    const prompt = `Create ${count} original practice questions for Class ${classNo}, ${subject}, topic ${topic}. ${levelInstruction} Return strict JSON array only. Each item must have question, options (array of 4 strings for MCQ), answer, explanation, difficulty. Avoid unsupported facts and do not claim prediction of an actual exam paper.`;
    const r = await fetch(`https://api-inference.huggingface.co/models/${model}`, { method:'POST', headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'}, body:JSON.stringify({inputs:prompt,parameters:{max_new_tokens:1800,temperature:0.45,return_full_text:false}})});
    const data = await r.json();
    if (!r.ok) return NextResponse.json({ error: data?.error || 'Model unavailable.' }, {status:502});
    const raw = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
    return NextResponse.json({ raw });
  } catch { return NextResponse.json({ error:'Practice generation failed.' },{status:500}); }
}
