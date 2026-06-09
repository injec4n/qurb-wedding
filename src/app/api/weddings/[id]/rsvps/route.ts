import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rsvps = await db.rsvpResponse.findMany({
      where: { weddingId: id },
      include: { guest: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: rsvps });
  } catch (error) {
    console.error('Fetch RSVPs error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch RSVPs' }, { status: 500 });
  }
}
