import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const row = {
    user_id: user.id,
    track: String(body.track || 'NCERT'),
    class_no: String(body.classNo || '12'),
    subject: String(body.subject || 'Physics'),
    chapter: body.chapter ? String(body.chapter) : null,
    topic: body.topic ? String(body.topic) : null,
    question: String(body.question || '').slice(0, 10000),
    student_answer: body.studentAnswer == null ? null : String(body.studentAnswer).slice(0, 5000),
    correct_answer: body.correctAnswer == null ? null : String(body.correctAnswer).slice(0, 5000),
    is_correct: Boolean(body.isCorrect),
    difficulty: body.difficulty ? String(body.difficulty) : null,
  };
  if (!row.question) return NextResponse.json({ error: 'Question is required.' }, { status: 400 });

  const { error } = await supabase.from('question_attempts').insert(row);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (row.topic) {
    const { data: current } = await supabase.from('topic_mastery').select('mastery,attempts,correct').eq('user_id', user.id).eq('class_no', row.class_no).eq('subject', row.subject).eq('chapter', row.chapter || '').eq('topic', row.topic).maybeSingle();
    const attempts = Number(current?.attempts || 0) + 1;
    const correct = Number(current?.correct || 0) + (row.is_correct ? 1 : 0);
    const mastery = Math.round((correct / attempts) * 100);
    await supabase.from('topic_mastery').upsert({ user_id: user.id, class_no: row.class_no, subject: row.subject, chapter: row.chapter || '', topic: row.topic, mastery, attempts, correct, last_practiced_at: new Date().toISOString() }, { onConflict: 'user_id,class_no,subject,chapter,topic' });
  }

  return NextResponse.json({ ok: true });
}
