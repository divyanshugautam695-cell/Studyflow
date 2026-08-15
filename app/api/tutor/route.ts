import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { question, classNo = '12', subject = 'Physics' } = await req.json();
    if (!question?.trim()) return NextResponse.json({ error: 'Please enter a question.' }, { status: 400 });

    const token = process.env.HF_TOKEN;
    if (!token) {
      return NextResponse.json({
        answer: 'The AI Tutor UI is ready, but no model key is configured yet. Add HF_TOKEN in Vercel/your local .env file to enable the free/open Hugging Face inference model.\n\nFor now, your selected profile is Class ' + classNo + ' • ' + subject + '.'
      });
    }

    const model = process.env.HF_MODEL || 'Qwen/Qwen2.5-7B-Instruct';
    const prompt = `You are StudyFlow, a careful Indian school tutor. Student profile: Class ${classNo}, subject ${subject}. Answer the student's question clearly and educationally. If it is a problem, solve it step-by-step, show formulas and units, then give one similar practice question. Do not claim an exam question is guaranteed. Encourage understanding rather than copying. Student question: ${question}`;
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 900, temperature: 0.35, return_full_text: false } }),
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data?.error || 'The model is temporarily unavailable.' }, { status: 502 });
    const text = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
    return NextResponse.json({ answer: text || 'The model returned no answer. Please try again.' });
  } catch {
    return NextResponse.json({ error: 'Unable to reach the AI service.' }, { status: 500 });
  }
}
