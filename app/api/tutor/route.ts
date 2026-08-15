import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { question, classNo = '12', subject = 'Physics' } = await req.json();

    if (!question?.trim()) {
      return NextResponse.json({ error: 'Please enter a question.' }, { status: 400 });
    }

    const token = process.env.HF_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: 'HF_TOKEN is not configured on the deployed server. Add it in Vercel Environment Variables and redeploy.' },
        { status: 500 },
      );
    }

    // Hugging Face now recommends the Inference Providers router for chat models.
    // It automatically selects an available provider instead of calling the
    // legacy api-inference.huggingface.co endpoint directly.
    const model = process.env.HF_MODEL || 'Qwen/Qwen2.5-7B-Instruct:fastest';

    const system = `You are StudyFlow AI, an expert Indian school tutor.
Student profile: Class ${classNo}, subject ${subject}.
Teach for understanding, not copying. Give accurate, age-appropriate explanations.
For numerical/problem questions: identify the concept, list known values, choose the formula or principle, solve step-by-step with units, verify the result, and give one similar practice question.
For conceptual questions: explain simply first, then add exam-relevant detail.
If the student is asking about a topic outside the selected subject, still help but clearly identify the relevant subject/topic.
Never claim that a question is guaranteed to appear in an exam. For JEE/NEET preparation, distinguish practice priority from prediction.`;

    const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: question.trim() },
        ],
        temperature: 0.35,
        max_tokens: 900,
      }),
      cache: 'no-store',
    });

    const raw = await response.text();
    let data: any = null;
    try {
      data = JSON.parse(raw);
    } catch {
      // Keep the raw response for a useful diagnostic below.
    }

    if (!response.ok) {
      const providerError = data?.error?.message || data?.error || data?.message || raw;
      return NextResponse.json(
        { error: `Hugging Face returned ${response.status}: ${String(providerError).slice(0, 700)}` },
        { status: 502 },
      );
    }

    const answer = data?.choices?.[0]?.message?.content;
    if (!answer) {
      return NextResponse.json(
        { error: 'The AI provider returned an empty answer. Please try again.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('StudyFlow tutor error:', error);
    return NextResponse.json(
      { error: 'Unable to reach the AI provider. Check the Vercel deployment logs and HF_TOKEN permissions.' },
      { status: 500 },
    );
  }
}
