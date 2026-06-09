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

    const data: Record<string, unknown> = { ...body };
    if (body.galleryImages && Array.isArray(body.galleryImages)) {
      data.galleryImages = JSON.stringify(body.galleryImages);
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
