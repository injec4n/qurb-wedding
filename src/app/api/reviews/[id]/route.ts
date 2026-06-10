import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth-helpers';

// GET /api/reviews/[id] - Get a single review
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const review = await db.review.findUnique({ where: { id } });

    if (!review) {
      return NextResponse.json({ success: false, error: 'التقييم غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json({ success: false, error: 'فشل في جلب التقييم' }, { status: 500 });
  }
}

// PUT /api/reviews/[id] - Update a review (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { type, name, rating, text, imageUrl, audioUrl, weddingName, isActive, order } = body;

    const existing = await db.review.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'التقييم غير موجود' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (type !== undefined) {
      const validTypes = ['text', 'image', 'audio'];
      if (!validTypes.includes(type)) {
        return NextResponse.json({ success: false, error: 'نوع التقييم غير صالح' }, { status: 400 });
      }
      updateData.type = type;
    }
    if (name !== undefined) updateData.name = name.trim();
    if (rating !== undefined) updateData.rating = Math.min(5, Math.max(1, rating));
    if (text !== undefined) updateData.text = text;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (audioUrl !== undefined) updateData.audioUrl = audioUrl;
    if (weddingName !== undefined) updateData.weddingName = weddingName;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (order !== undefined) updateData.order = order;

    const review = await db.review.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ success: false, error: 'فشل في تحديث التقييم' }, { status: 500 });
  }
}

// DELETE /api/reviews/[id] - Delete a review (admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const { id } = await params;

    const existing = await db.review.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'التقييم غير موجود' }, { status: 404 });
    }

    await db.review.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ success: false, error: 'فشل في حذف التقييم' }, { status: 500 });
  }
}
