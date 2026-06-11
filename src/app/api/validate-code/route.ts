import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { valid: false, error: 'الكود مطلوب' },
        { status: 400 }
      );
    }

    const sheetsUrl = process.env.GOOGLE_SHEETS_URL;

    if (!sheetsUrl) {
      console.log('⚠️ No GOOGLE_SHEETS_URL - allowing code:', code);
      return NextResponse.json({ valid: true, name: 'وضع التطوير' });
    }

    const validateUrl = `${sheetsUrl}?action=validate&code=${encodeURIComponent(code)}`;

    const response = await fetch(validateUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();

    if (data.valid) {
      return NextResponse.json({ valid: true, name: data.name || '' });
    }

    return NextResponse.json(
      { valid: false, error: data.error || 'الكود غير صالح أو متوقف' },
      { status: 403 }
    );
  } catch (error) {
    console.error('Code validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'حصل خطأ في التحقق من الكود' },
      { status: 500 }
    );
  }
}
