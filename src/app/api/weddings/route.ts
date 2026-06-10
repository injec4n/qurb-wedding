import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTheme } from '@/lib/themes';
import { verifyAdminAuth } from '@/lib/auth-helpers';

export async function GET() {
  // Admin auth check - middleware already protects, but double-check
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const weddings = await db.wedding.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            guests: true,
            rsvps: true,
          },
        },
      },
    });
    return NextResponse.json({ success: true, data: weddings });
  } catch (error) {
    console.error('Fetch weddings error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch weddings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Admin auth check
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, groomName, brideName, weddingDate, weddingTime, venueName, ...rest } = body;

    if (!slug || !groomName || !brideName || !weddingDate || !weddingTime || !venueName) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Check if slug already exists
    const existing = await db.wedding.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 });
    }

    // Apply theme colors if theme is specified but colors aren't customized
    const themeName = rest.theme || 'royal-gold';
    const themeConfig = getTheme(themeName as Parameters<typeof getTheme>[0]);
    const themeColors = themeConfig.colors;

    // Use provided colors, or fall back to theme colors
    const primaryColor = rest.primaryColor || themeColors.primary;
    const secondaryColor = rest.secondaryColor || themeColors.secondary;
    const backgroundColor = rest.backgroundColor || themeColors.background;
    const textColor = rest.textColor || themeColors.text;
    const buttonColor = rest.buttonColor || themeColors.button;
    const accentColor = rest.accentColor || themeColors.accent;

    const wedding = await db.wedding.create({
      data: {
        slug,
        groomName,
        brideName,
        weddingDate,
        weddingTime,
        venueName,
        venueAddress: rest.venueAddress || '',
        googleMapsLink: rest.googleMapsLink || '',
        welcomeMessage: rest.welcomeMessage || '',
        contactPhone: rest.contactPhone || '',
        coverImage: rest.coverImage || '',
        coverCategory: rest.coverCategory || '',
        galleryImages: JSON.stringify(rest.galleryImages || []),
        backgroundMusicUrl: rest.backgroundMusicUrl || '',
        couplePhoto: rest.couplePhoto || '',
        clientPassword: rest.clientPassword || '',
        theme: themeName,
        colorPreset: rest.colorPreset || '',
        primaryColor,
        secondaryColor,
        backgroundColor,
        textColor,
        buttonColor,
        accentColor,
        enableRsvp: rest.enableRsvp ?? true,
        enableGallery: rest.enableGallery ?? true,
        enableCountdown: rest.enableCountdown ?? true,
        enableMusic: rest.enableMusic ?? true,
        enableGuestPersonalization: rest.enableGuestPersonalization ?? true,
        // Customizable text fields with defaults
        bismallahText: rest.bismallahText ?? 'بسم الله الرحمن الرحيم',
        invitationTitle: rest.invitationTitle ?? '',
        heroSubtitle: rest.heroSubtitle ?? 'بقلوب يملؤها الشوق، بيتشرفوا بدعوتكم لمشاركتنا أجمل ليلة في العمر',
        heroSubSubtitle: rest.heroSubSubtitle ?? 'ليلة هنلتقي فيها على مائدة الحب، والله يجمعنا على خير وبركة',
        detailsTitle: rest.detailsTitle ?? 'تفاصيل ليلة العمر',
        detailsSubtitle: rest.detailsSubtitle ?? 'بشوق ننتظر حضوركم لنشارك معاً فرحة ليلة العمر',
        venueTitle: rest.venueTitle ?? 'حيث تُحتفل الفرحة',
        rsvpTitle: rest.rsvpTitle ?? 'هنيتشرفوا بحضوركم ليلة العمر؟',
        rsvpAttendingText: rest.rsvpAttendingText ?? 'يتشرفني الحضور بكل سرور',
        rsvpNotAttendingText: rest.rsvpNotAttendingText ?? 'أعتذر، وأتمنى لكم أجمل ليلة',
        cardInvitationText: rest.cardInvitationText ?? 'بيتشرفوا بدعوتكم لحضور حفل زفافهم',
        guestWelcomeText: rest.guestWelcomeText ?? 'فرحتنا مش بتتكمل غير بوجودكم معانا',
        guestSubWelcomeText: rest.guestSubWelcomeText ?? 'بوجودكم تزدان ليلتنا وتكتمل فرحتنا',
      },
    });

    return NextResponse.json({ success: true, data: wedding }, { status: 201 });
  } catch (error) {
    console.error('Create wedding error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create wedding' }, { status: 500 });
  }
}
