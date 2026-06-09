import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const wedding = await db.wedding.findUnique({ where: { id } });
    if (!wedding) {
      return NextResponse.json(
        { success: false, error: 'Wedding not found' },
        { status: 404 }
      );
    }

    const updated = await db.wedding.update({
      where: { id },
      data: { visitCount: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      data: { visitCount: updated.visitCount },
    });
  } catch (error) {
    console.error('Visit tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track visit' },
      { status: 500 }
    );
  }
}
