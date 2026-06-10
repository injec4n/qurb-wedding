import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth-helpers';

// GET /api/reviews - List all reviews (public: only active, admin: all)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    const isAdmin = await verifyAdminAuth();

    const where = activeOnly && !isAdmin ? { isActive: true } : {};

    const reviews = await db.review.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, error: 'فشل في جلب التقييمات' }, { status: 500 });
  }
}

// POST /api/reviews - Create a new review (admin only)
export async function POST(request: NextRequest) {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, name, rating, text, imageUrl, audioUrl, weddingName, isActive, order } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'اسم العميل مطلوب' }, { status: 400 });
    }

    const validTypes = ['text', 'image', 'audio'];
    if (type && !validTypes.includes(type)) {
      return NextResponse.json({ success: false, error: 'نوع التقييم غير صالح' }, { status: 400 });
    }

    const review = await db.review.create({
      data: {
        type: type || 'text',
        name: name.trim(),
        rating: Math.min(5, Math.max(1, rating || 5)),
        text: text || '',
        imageUrl: imageUrl || '',
        audioUrl: audioUrl || '',
        weddingName: weddingName || '',
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0,
      },
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ success: false, error: 'فشل في إنشاء التقييم' }, { status: 500 });
  }
}

// PUT /api/reviews - Update review order (bulk) (admin only)
export async function PUT(request: NextRequest) {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orders } = body as { orders: { id: string; order: number }[] };

    if (!orders || !Array.isArray(orders)) {
      return NextResponse.json({ success: false, error: 'بيانات الطلب غير صالحة' }, { status: 400 });
    }

    await Promise.all(
      orders.map(({ id, order }) =>
        db.review.update({ where: { id }, data: { order } })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating review orders:', error);
    return NextResponse.json({ success: false, error: 'فشل في تحديث ترتيب التقييمات' }, { status: 500 });
  }
}
