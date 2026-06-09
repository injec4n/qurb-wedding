import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const guests = await db.guest.findMany({
      where: { weddingId: id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: guests });
  } catch (error) {
    console.error('Fetch guests error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch guests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, phone } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Guest name is required' }, { status: 400 });
    }

    const guestLink = encodeURIComponent(name.trim());
    const guest = await db.guest.create({
      data: {
        weddingId: id,
        name: name.trim(),
        phone: phone || '',
        guestLink,
      },
    });
    return NextResponse.json({ success: true, data: guest }, { status: 201 });
  } catch (error) {
    console.error('Add guest error:', error);
    return NextResponse.json({ success: false, error: 'Failed to add guest' }, { status: 500 });
  }
}
