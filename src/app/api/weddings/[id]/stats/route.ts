import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Check wedding exists
    const wedding = await db.wedding.findUnique({
      where: { id },
      select: { id: true, visitCount: true },
    });

    if (!wedding) {
      return NextResponse.json({ success: false, error: 'Wedding not found' }, { status: 404 });
    }

    // Get total guests count
    const totalGuests = await db.guest.count({
      where: { weddingId: id },
    });

    // Get attending count
    const attendingCount = await db.rsvpResponse.count({
      where: { weddingId: id, status: 'attending' },
    });

    // Get not-attending count
    const notAttendingCount = await db.rsvpResponse.count({
      where: { weddingId: id, status: 'not-attending' },
    });

    // Get pending count (RSVPs with status 'pending')
    const pendingRsvpCount = await db.rsvpResponse.count({
      where: { weddingId: id, status: 'pending' },
    });

    // Guests without any RSVP (also considered pending)
    const guestsWithoutRsvp = await db.guest.count({
      where: {
        weddingId: id,
        rsvp: null,
      },
    });

    const pendingCount = pendingRsvpCount + guestsWithoutRsvp;

    return NextResponse.json({
      success: true,
      data: {
        visitCount: wedding.visitCount,
        totalGuests,
        attendingCount,
        notAttendingCount,
        pendingCount,
      },
    });
  } catch (error) {
    console.error('Fetch wedding stats error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch wedding stats' }, { status: 500 });
  }
}
