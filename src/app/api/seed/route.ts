import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Check if seed data already exists
    const existing = await db.wedding.findFirst({ where: { slug: 'mohamed-fatma' } });
    if (existing) {
      return NextResponse.json({ success: true, message: 'Seed data already exists', data: existing });
    }

    const wedding = await db.wedding.create({
      data: {
        slug: 'mohamed-fatma',
        groomName: 'محمد',
        brideName: 'فاطمة',
        weddingDate: '2025-08-15',
        weddingTime: '20:00',
        venueName: 'قاعة الأندلس',
        venueAddress: 'القاهرة، مصر',
        googleMapsLink: 'https://maps.google.com/?q=30.0444,31.2357',
        welcomeMessage: 'يسعدنا دعوتكم لحضور حفل زفافنا',
        contactPhone: '+201012345678',
        coverImage: '',
        galleryImages: JSON.stringify([]),
        backgroundMusicUrl: '',
        clientPassword: '123456',
        couplePhoto: '',
        theme: 'royal-gold',
        colorPreset: '',
        primaryColor: '#C9A84C',
        secondaryColor: '#152040',
        backgroundColor: '#0A0F1E',
        textColor: '#F5E6C8',
        buttonColor: '#C9A84C',
        accentColor: '#E0C878',
        enableRsvp: true,
        enableGallery: true,
        enableCountdown: true,
        enableMusic: true,
        enableGuestPersonalization: true,
        // Customizable text fields with defaults
        bismallahText: 'بسم الله الرحمن الرحيم',
        invitationTitle: '',
        heroSubtitle: 'بقلوب يملؤها الشوق، بيتشرفوا بدعوتكم لمشاركتنا أجمل ليلة في العمر',
        heroSubSubtitle: 'ليلة هنلتقي فيها على مائدة الحب، والله يجمعنا على خير وبركة',
        detailsTitle: 'تفاصيل ليلة العمر',
        detailsSubtitle: 'بشوق ننتظر حضوركم لنشارك معاً فرحة ليلة العمر',
        venueTitle: 'حيث تُحتفل الفرحة',
        rsvpTitle: 'هنيتشرفوا بحضوركم ليلة العمر؟',
        rsvpAttendingText: 'يتشرفني الحضور بكل سرور',
        rsvpNotAttendingText: 'أعتذر، وأتمنى لكم أجمل ليلة',
        cardInvitationText: 'بيتشرفوا بدعوتكم لحضور حفل زفافهم',
        guestWelcomeText: 'فرحتنا مش بتتكمل غير بوجودكم معانا',
        guestSubWelcomeText: 'بوجودكم تزدان ليلتنا وتكتمل فرحتنا',
      },
    });

    // Add sample guests
    const guestNames = ['محمود', 'أحمد', 'سارة', 'نورا', 'خالد', 'هند', 'عمر', 'ريم'];
    for (const name of guestNames) {
      await db.guest.create({
        data: {
          weddingId: wedding.id,
          name,
          phone: '',
          guestLink: encodeURIComponent(name),
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Seed data created', data: wedding });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: 'Failed to seed data' }, { status: 500 });
  }
}
