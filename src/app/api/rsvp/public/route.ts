import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weddingId, guestName, status, message } = body;

    if (!weddingId || !guestName || !status) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (!['attending', 'not-attending'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    // Find or create guest
    let guest = await db.guest.findFirst({
      where: { weddingId, name: guestName },
    });

    if (!guest) {
      guest = await db.guest.create({
        data: {
          weddingId,
          name: guestName,
          phone: '',
          guestLink: encodeURIComponent(guestName.trim()),
        },
      });
    }

    const rsvp = await db.rsvpResponse.upsert({
      where: { guestId: guest.id },
      update: { status, message: message || '' },
      create: { weddingId, guestId: guest.id, status, message: message || '' },
    });
    return NextResponse.json({ success: true, data: rsvp });
  } catch (error) {
    console.error('Public RSVP error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit RSVP' }, { status: 500 });
  }
}
