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
        theme: 'classic-gold',
        colorPreset: '',
        primaryColor: '#D4A853',
        secondaryColor: '#1A1A2E',
        backgroundColor: '#0D0D1A',
        textColor: '#FFFFFF',
        buttonColor: '#D4A853',
        accentColor: '#E8C874',
        enableRsvp: true,
        enableGallery: true,
        enableCountdown: true,
        enableMusic: true,
        enableGuestPersonalization: true,
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
