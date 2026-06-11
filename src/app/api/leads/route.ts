import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      groomName,
      brideName,
      weddingDate,
      venueName,
      phone,
      email,
      notes
    } = body;

    if (!groomName || !brideName || !phone) {
      return NextResponse.json(
        { success: false, error: 'اسم العريس والعروسة ورقم الواتساب مطلوبين' },
        { status: 400 }
      );
    }

    const sheetsUrl = process.env.GOOGLE_SHEETS_URL;

    if (!sheetsUrl) {
      console.log(
        '📋 New Lead:',
        JSON.stringify({
          timestamp: new Date().toISOString(),
          groomName,
          brideName,
          weddingDate,
          venueName,
          phone,
          email,
          notes
        })
      );

      return NextResponse.json({ success: true, message: 'تم استلام طلبكم' });
    }

    const response = await fetch(sheetsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        groomName,
        brideName,
        weddingDate,
        venueName,
        phone,
        email: email || '',
        notes: notes || ''
      })
    });

    if (!response.ok) {
      console.error(
        'Google Sheets error:',
        response.status,
        await response.text()
      );
    }

    return NextResponse.json({ success: true, message: 'تم استلام طلبكم' });
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { success: false, error: 'حصل خطأ، حاول تاني' },
      { status: 500 }
    );
  }
}
