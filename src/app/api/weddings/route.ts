import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTheme } from '@/lib/themes';

export async function GET() {
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
        groomPhoto: rest.groomPhoto || '',
        bridePhoto: rest.bridePhoto || '',
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
      },
    });

    return NextResponse.json({ success: true, data: wedding }, { status: 201 });
  } catch (error) {
    console.error('Create wedding error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create wedding' }, { status: 500 });
  }
}
