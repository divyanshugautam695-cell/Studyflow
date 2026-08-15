import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { question = '', classNo = '12', subject = 'Physics', imageData = '' } = await req.json();
    const cleanQuestion = String(question || '').trim();

    if (!cleanQuestion && !imageData) {
      return NextResponse.json({ error: 'Type a question, upload a doubt photo, or use voice input.' }, { status: 400 });
    }

    if (imageData && typeof imageData === 'string' && imageData.length > 7_000_000) {
      return NextResponse.json({ error: 'That image is too large. Please choose a smaller photo and try again.' }, { status: 413 });
    }

    const token = process.env.HF_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: 'HF_TOKEN is not configured on the deployed server. Add it in Vercel Environment Variables and redeploy.' },
        { status: 500 },
      );
    }

    const isVision = Boolean(imageData);
    const model = isVision
      ? (process.env.HF_VISION_MODEL || 'Qwen/Qwen2.5-VL-3B-Instruct:fastest')
      : (process.env.HF_MODEL || 'Qwen/Qwen2.5-7B-Instruct:fastest');

    const system = `You are StudyFlow AI, an expert Indian school and competitive-exam tutor.
Student profile: Class ${classNo}, subject ${subject}.
Teach for understanding, not copying. Give accurate, age-appropriate explanations.
For numerical/problem questions: identify the concept, list known values, choose the formula or principle, solve step-by-step with units, verify the result, and give one similar practice question.
For conceptual questions: explain simply first, then add exam-relevant detail.
If a doubt photo is supplied, carefully read the question, equations, diagrams and labels from the image before answering. If any part is unreadable, say exactly what is unclear instead of inventing it.
When the image contains a handwritten or printed exam question, solve the actual question shown and explain the reasoning.
For JEE/NEET preparation, distinguish practice priority from prediction and never claim a question is guaranteed to appear in an exam.`;

    const userContent: any[] = [];
    if (cleanQuestion) userContent.push({ type: 'text', text: cleanQuestion });
    else userContent.push({ type: 'text', text: 'Solve and explain the doubt shown in this photo. Identify the concept first, then give a clear step-by-step solution and one similar practice question.' });
    if (imageData) {
      userContent.push({ type: 'image_url', image_url: { url: imageData } });
    }

    const messages = [
      { role: 'system', content: system },
      { role: 'user', content: isVision ? userContent : (cleanQuestion || userContent[0].text) },
    ];

    const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, messages, temperature: 0.25, max_tokens: 1200 }),
      cache: 'no-store',
    });

    const raw = await response.text();
    let data: any = null;
    try { data = JSON.parse(raw); } catch { /* keep raw for diagnostics */ }

    if (!response.ok) {
      const providerError = data?.error?.message || data?.error || data?.message || raw;
      return NextResponse.json(
        { error: `Hugging Face returned ${response.status}: ${String(providerError).slice(0, 700)}` },
        { status: 502 },
      );
    }

    const answer = data?.choices?.[0]?.message?.content;
    if (!answer) return NextResponse.json({ error: 'The AI provider returned an empty answer. Please try again.' }, { status: 502 });

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('StudyFlow tutor error:', error);
    return NextResponse.json(
      { error: 'Unable to reach the AI provider. Check the Vercel deployment logs and HF_TOKEN/HF_VISION_MODEL configuration.' },
      { status: 500 },
    );
  }
}
