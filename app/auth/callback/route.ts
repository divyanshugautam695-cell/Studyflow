import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const nextParam = requestUrl.searchParams.get('next') || '/dashboard';
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/dashboard';

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', requestUrl.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL('/login?error=auth_callback', requestUrl.origin));
  }

  // createClient() writes the Supabase auth cookies through Next.js cookies().
  // Redirect only after the session exchange succeeds so middleware can read
  // the authenticated session on the next request.
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
