import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { themes } from '@/lib/themes';

const demoWeddings = [
  {
    slug: 'demo-royal-gold',
    groomName: 'محمد',
    brideName: 'فاطمة',
    theme: 'royal-gold' as const,
    venueName: 'قاعة الأندلس',
    venueAddress: 'القاهرة، مصر',
  },
  {
    slug: 'demo-luxury-dark',
    groomName: 'أحمد',
    brideName: 'نورة',
    theme: 'luxury-dark' as const,
    venueName: 'فندق الريتز كارلتون',
    venueAddress: 'جدة، السعودية',
  },
  {
    slug: 'demo-floral-romance',
    groomName: 'خالد',
    brideName: 'ريم',
    theme: 'floral-romance' as const,
    venueName: 'حديقة الزهور',
    venueAddress: 'الإسكندرية، مصر',
  },
  {
    slug: 'demo-arabic-heritage',
    groomName: 'عمر',
    brideName: 'هند',
    theme: 'arabic-heritage' as const,
    venueName: 'قصر الثقافة',
    venueAddress: 'الرياض، السعودية',
  },
  {
    slug: 'demo-minimal-modern',
    groomName: 'محمود',
    brideName: 'سارة',
    theme: 'minimal-modern' as const,
    venueName: 'فندق فورسيزونز',
    venueAddress: 'دبي، الإمارات',
  },
];

export async function GET() {
  try {
    const created: string[] = [];

    for (const demo of demoWeddings) {
      const existing = await db.wedding.findUnique({ where: { slug: demo.slug } });
      if (existing) {
        created.push(demo.slug);
        continue;
      }

      const themeConfig = themes[demo.theme];
      const colors = themeConfig.colors;

      await db.wedding.create({
        data: {
          slug: demo.slug,
          groomName: demo.groomName,
          brideName: demo.brideName,
          weddingDate: '2025-09-15',
          weddingTime: '20:00',
          venueName: demo.venueName,
          venueAddress: demo.venueAddress,
          googleMapsLink: 'https://maps.google.com/?q=30.0444,31.2357',
          welcomeMessage: 'يسعدنا دعوتكم لحضور حفل زفافنا',
          contactPhone: '+201012345678',
          coverImage: '',
          galleryImages: JSON.stringify([]),
          backgroundMusicUrl: '',
          clientPassword: 'demo123',
          couplePhoto: '',
          theme: demo.theme,
          colorPreset: '',
          primaryColor: colors.primary,
          secondaryColor: colors.secondary,
          backgroundColor: colors.background,
          textColor: colors.text,
          buttonColor: colors.button,
          accentColor: colors.accent,
          enableRsvp: true,
          enableGallery: true,
          enableCountdown: true,
          enableMusic: true,
          enableGuestPersonalization: true,
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

      created.push(demo.slug);
    }

    return NextResponse.json({
      success: true,
      message: `Demo weddings ready: ${created.join(', ')}`,
      slugs: created,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: 'Failed to seed data' }, { status: 500 });
  }
}
