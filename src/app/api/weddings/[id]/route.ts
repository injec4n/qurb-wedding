import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const wedding = await db.wedding.findUnique({ where: { id } });
    if (!wedding) {
      return NextResponse.json({ success: false, error: 'Wedding not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: wedding });
  } catch (error) {
    console.error('Fetch wedding error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch wedding' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Whitelist allowed fields to prevent mass assignment
    const allowedFields = [
      'groomName', 'brideName', 'slug', 'weddingDate', 'weddingTime',
      'venueName', 'venueAddress', 'googleMapsLink', 'welcomeMessage',
      'contactPhone', 'coverImage', 'coverCategory', 'backgroundMusicUrl',
      'couplePhoto', 'clientPassword', 'theme',
      'colorPreset', 'primaryColor', 'secondaryColor', 'backgroundColor',
      'textColor', 'buttonColor', 'accentColor', 'enableRsvp',
      'enableGallery', 'enableCountdown', 'enableMusic',
      'enableGuestPersonalization', 'isActive',
    ];

    const data: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        data[field] = body[field];
      }
    }

    // Handle galleryImages separately (array → JSON string)
    if (body.galleryImages !== undefined) {
      data.galleryImages = Array.isArray(body.galleryImages)
        ? JSON.stringify(body.galleryImages)
        : body.galleryImages;
    }

    // Check slug uniqueness if slug is being changed
    if (data.slug) {
      const existing = await db.wedding.findFirst({
        where: { slug: data.slug as string, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json({ success: false, error: 'الرابط مستخدم بالفعل' }, { status: 409 });
      }
    }

    const wedding = await db.wedding.update({
      where: { id },
      data,
    });
    return NextResponse.json({ success: true, data: wedding });
  } catch (error) {
    console.error('Update wedding error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update wedding' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.wedding.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete wedding error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete wedding' }, { status: 500 });
  }
}
