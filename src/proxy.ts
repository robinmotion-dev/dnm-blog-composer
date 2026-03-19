import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_EMAILS = ['ap@dnm.berlin', 'aw@dnm.berlin', 'rk@dnm.berlin'];
const AUTH_COOKIE = 'dnm-auth';

async function verifyToken(token: string, secret: string): Promise<string | null> {
  try {
    const dotIndex = token.indexOf('.');
    if (dotIndex === -1) return null;

    const emailB64 = token.slice(0, dotIndex);
    const sigB64 = token.slice(dotIndex + 1);
    if (!emailB64 || !sigB64) return null;

    const email = atob(emailB64);

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sig = Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0));
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      sig,
      new TextEncoder().encode(email)
    );

    if (!valid || !ALLOWED_EMAILS.includes(email)) return null;
    return email;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET ?? '';

  if (!token || !secret || !(await verifyToken(token, secret))) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
