import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const nextParam = requestUrl.searchParams.get('next') || '/dashboard';
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/dashboard';
  const redirectUrl = new URL(next, requestUrl.origin);

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', requestUrl.origin));
  }

  // Create the redirect response first. Supabase's SSR client must write the
  // refreshed auth cookies onto this exact response so the browser receives
  // the session created by exchangeCodeForSession().
  const response = NextResponse.redirect(redirectUrl);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          const cookieHeader = request.headers.get('cookie') || '';
          return cookieHeader
            .split(';')
            .filter(Boolean)
            .map((part) => {
              const index = part.indexOf('=');
              return {
                name: index >= 0 ? part.slice(0, index).trim() : part.trim(),
                value: index >= 0 ? decodeURIComponent(part.slice(index + 1).trim()) : '',
              };
            });
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=auth_callback&message=${encodeURIComponent(error.message)}`, requestUrl.origin),
    );
  }

  return response;
}
