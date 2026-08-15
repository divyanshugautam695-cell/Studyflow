import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Sign in to save progress.' }, { status: 401 });

    const body = await req.json();
    const classNo = String(body.classNo || '12');
    const subject = String(body.subject || 'Physics');
    const chapter = String(body.chapter || '');
    const topic = String(body.topic || chapter || 'General');
    const isCorrect = Boolean(body.isCorrect);

    const { data: existing } = await supabase
      .from('topic_mastery')
      .select('attempts, correct')
      .eq('user_id', user.id)
      .eq('class_no', classNo)
      .eq('subject', subject)
      .eq('chapter', chapter)
      .eq('topic', topic)
      .maybeSingle();

    const attempts = (existing?.attempts || 0) + 1;
    const correct = (existing?.correct || 0) + (isCorrect ? 1 : 0);
    const mastery = Math.round((correct / attempts) * 100);

    const { error } = await supabase.from('topic_mastery').upsert({
      user_id: user.id, class_no: classNo, subject, chapter, topic,
      attempts, correct, mastery, last_practiced_at: new Date().toISOString(),
    }, { onConflict: 'user_id,class_no,subject,chapter,topic' });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ mastery, attempts, correct });
  } catch (error) {
    console.error('StudyFlow mastery error:', error);
    return NextResponse.json({ error: 'Unable to save progress.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Sign in to view progress.' }, { status: 401 });
    const { data, error } = await supabase.from('topic_mastery').select('*').order('mastery', { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ mastery: data || [] });
  } catch {
    return NextResponse.json({ error: 'Unable to load progress.' }, { status: 500 });
  }
}
