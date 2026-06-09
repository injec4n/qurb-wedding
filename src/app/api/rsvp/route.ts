import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weddingId, guestId, status, message } = body;

    if (!weddingId || !guestId || !status) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (!['attending', 'not-attending'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const rsvp = await db.rsvpResponse.upsert({
      where: { guestId },
      update: { status, message: message || '' },
      create: { weddingId, guestId, status, message: message || '' },
    });
    return NextResponse.json({ success: true, data: rsvp });
  } catch (error) {
    console.error('RSVP error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit RSVP' }, { status: 500 });
  }
}
