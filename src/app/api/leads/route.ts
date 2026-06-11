import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      accessCode,
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
      enableRsvp,
      enableCountdown,
      enableMusic,
      enableGallery,
      enableGuestPersonalization,
      notes
    } = body;

    if (!accessCode) {
      return NextResponse.json(
        { success: false, error: 'كود الدخول مطلوب' },
        { status: 400 }
      );
    }

    const sheetsUrl = process.env.GOOGLE_SHEETS_URL;

    if (sheetsUrl) {
      try {
        const validateUrl = `${sheetsUrl}?action=validate&code=${encodeURIComponent(accessCode)}`;
        const validateRes = await fetch(validateUrl);
        const validateData = await validateRes.json();

        if (!validateData.valid) {
          return NextResponse.json(
            { success: false, error: 'الكود غير صالح أو متوقف' },
            { status: 403 }
          );
        }
      } catch (validateError) {
        console.error('Code validation error:', validateError);
        return NextResponse.json(
          { success: false, error: 'حصل خطأ في التحقق من الكود' },
          { status: 500 }
        );
      }
    }

    if (!groomName || !brideName || !contactPhone) {
      return NextResponse.json(
        { success: false, error: 'اسم العريس والعروسة ورقم الواتساب مطلوبين' },
        { status: 400 }
      );
    }

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
      features: [
        enableRsvp ? 'تأكيد حضور' : '',
        enableCountdown ? 'عداد تنازلي' : '',
        enableMusic ? 'مزيكا' : '',
        enableGallery ? 'معرض صور' : '',
        enableGuestPersonalization ? 'ظرف باسم الضيف' : ''
      ]
        .filter(Boolean)
        .join(' | '),
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
