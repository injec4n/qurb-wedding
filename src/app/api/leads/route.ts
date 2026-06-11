import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      groomName,
      brideName,
      weddingDate,
      weddingTime,
      venueName,
      venueAddress,
      googleMapsLink,
      welcomeMessage,
      contactPhone,
      theme,
      notes
    } = body;

    if (!groomName || !brideName || !contactPhone) {
      return NextResponse.json(
        { success: false, error: 'اسم العريس والعروسة ورقم الواتساب مطلوبين' },
        { status: 400 }
      );
    }

    const sheetsUrl = process.env.GOOGLE_SHEETS_URL;

    // البيانات بالترتيب زي الشيت: التاريخ | العريس | العروسة | ميعاد الزفاف | وقت الزفاف | القاعة | العنوان | الخريطة | الواتساب | القالب | رسالة ترحيب | ملاحظات
    const leadData = {
      timestamp: new Date().toLocaleString('ar-EG', {
        timeZone: 'Africa/Cairo'
      }),
      groomName,
      brideName,
      weddingDate: weddingDate || '',
      weddingTime: weddingTime || '',
      venueName: venueName || '',
      venueAddress: venueAddress || '',
      googleMapsLink: googleMapsLink || '',
      contactPhone,
      theme: theme || 'royal-gold',
      welcomeMessage: welcomeMessage || '',
      notes: notes || ''
    };

    if (!sheetsUrl) {
      console.log('📋 New Lead:', JSON.stringify(leadData, null, 2));
      return NextResponse.json({ success: true, message: 'تم استلام طلبكم' });
    }

    try {
      const response = await fetch(sheetsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });

      if (!response.ok) {
        console.error(
          'Google Sheets error:',
          response.status,
          await response.text()
        );
      }
    } catch (sheetsError) {
      console.error('Google Sheets connection error:', sheetsError);
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
