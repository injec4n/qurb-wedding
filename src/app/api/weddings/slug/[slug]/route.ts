import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const wedding = await db.wedding.findUnique({ where: { slug } });
    if (!wedding) {
      return NextResponse.json({ success: false, error: 'Wedding not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: wedding });
  } catch (error) {
    console.error('Fetch wedding by slug error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch wedding' }, { status: 500 });
  }
}
