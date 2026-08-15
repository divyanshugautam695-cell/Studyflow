import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const patch: Record<string, string> = {};
  if (typeof body.displayName === 'string' && body.displayName.trim()) patch.display_name = body.displayName.trim().slice(0, 80);
  if (typeof body.classNo === 'string' && /^(?:[1-9]|1[0-2])$/.test(body.classNo)) patch.class_no = body.classNo;
  if (typeof body.targetExam === 'string' && ['NCERT', 'JEE Main', 'JEE Advanced', 'NEET UG'].includes(body.targetExam)) patch.target_exam = body.targetExam;

  const { data, error } = await supabase.from('profiles').upsert({ id: user.id, ...patch }, { onConflict: 'id' }).select('id,display_name,class_no,target_exam').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ profile: data });
}
