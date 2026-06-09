import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'zafati2025';
const COOKIE_NAME = 'zafati_admin_auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true });
      response.cookies.set(COOKIE_NAME, 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
      });
      return response;
    }

    return NextResponse.json({ success: false, error: 'كلمة المرور غير صحيحة' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: 'حدث خطأ' }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const auth = cookieStore.get(COOKIE_NAME);
  return NextResponse.json({ authenticated: auth?.value === 'authenticated' });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
