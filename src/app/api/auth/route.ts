import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_USERS: Record<string, string> = {
  'ap@dnm.berlin': 'Alexandra Pille',
  'aw@dnm.berlin': 'Andrea Wichmann',
  'rk@dnm.berlin': 'Robin Kornemann',
  'office@dnm.berlin': 'DNM Office',
};

async function createToken(email: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(email)
  );
  const emailB64 = btoa(email);
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `${emailB64}.${sigB64}`;
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const authPassword = process.env.AUTH_PASSWORD ?? 'DNM-PW-BlogComposer';
  const authSecret = process.env.AUTH_SECRET;

  if (!authSecret) {
    return NextResponse.json({ error: 'Server nicht konfiguriert' }, { status: 500 });
  }

  const normalizedEmail = email?.toLowerCase()?.trim();

  if (!normalizedEmail || !ALLOWED_USERS[normalizedEmail]) {
    return NextResponse.json({ error: 'Zugang verweigert' }, { status: 401 });
  }

  if (password !== authPassword) {
    return NextResponse.json({ error: 'Falsches Passwort' }, { status: 401 });
  }

  const token = await createToken(normalizedEmail, authSecret);

  const response = NextResponse.json({
    success: true,
    name: ALLOWED_USERS[normalizedEmail],
  });

  response.cookies.set('dnm-auth', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 Tage
    path: '/',
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('dnm-auth');
  return response;
}
