import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [{ data: profile }, { data: mastery }, { data: attempts }, { data: sessions }] = await Promise.all([
    supabase.from('profiles').select('id,display_name,class_no,target_exam').eq('id', user.id).maybeSingle(),
    supabase.from('topic_mastery').select('class_no,subject,chapter,topic,mastery,attempts,correct,last_practiced_at').eq('user_id', user.id),
    supabase.from('question_attempts').select('track,class_no,subject,chapter,topic,is_correct,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(500),
    supabase.from('study_sessions').select('minutes,completed,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(100),
  ]);

  if (!profile) {
    const fallbackName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Student';
    const { data: created } = await supabase.from('profiles').upsert({ id: user.id, display_name: fallbackName }, { onConflict: 'id' }).select('id,display_name,class_no,target_exam').single();
    return NextResponse.json(build(created, mastery || [], attempts || [], sessions || []));
  }

  return NextResponse.json(build(profile, mastery || [], attempts || [], sessions || []));
}

function build(profile: any, mastery: any[], attempts: any[], sessions: any[]) {
  const totalAttempts = attempts.length;
  const correct = attempts.filter((a) => a.is_correct).length;
  const accuracy = totalAttempts ? Math.round((correct / totalAttempts) * 100) : 0;
  const masteryAverage = mastery.length ? Math.round(mastery.reduce((s, x) => s + Number(x.mastery || 0), 0) / mastery.length) : 0;
  const weakTopics = [...mastery].sort((a, b) => Number(a.mastery) - Number(b.mastery)).slice(0, 5);
  const completedMinutes = sessions.filter((s) => s.completed).reduce((s, x) => s + Number(x.minutes || 0), 0);
  const readiness = totalAttempts || mastery.length ? Math.round((masteryAverage * 0.6) + (accuracy * 0.4)) : 0;

  const days = new Set<string>();
  for (const item of [...attempts, ...sessions]) {
    if (item.created_at) days.add(new Date(item.created_at).toISOString().slice(0, 10));
  }
  let streak = 0;
  const cursor = new Date();
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return {
    user: { id: profile.id, displayName: profile.display_name || 'Student' },
    profile: { classNo: profile.class_no || '12', targetExam: profile.target_exam || 'NCERT' },
    stats: { readiness, accuracy, masteryAverage, totalAttempts, completedMinutes, streak, weakCount: mastery.filter((x) => Number(x.mastery) < 60).length },
    weakTopics,
    recentAttempts: attempts.slice(0, 20),
  };
}
