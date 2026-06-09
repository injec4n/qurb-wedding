import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { slug, password } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'رابط الدعوة مطلوب' },
        { status: 400 }
      );
    }

    const wedding = await db.wedding.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        groomName: true,
        brideName: true,
        clientPassword: true,
      },
    });

    if (!wedding) {
      return NextResponse.json(
        { success: false, error: 'لم يتم العثور على الدعوة' },
        { status: 404 }
      );
    }

    // If no clientPassword is set, allow access
    if (!wedding.clientPassword) {
      const cookieStore = await cookies();
      cookieStore.set(`zafati_client_${slug}`, 'authenticated', {
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 24 hours
        sameSite: 'lax',
        path: '/',
      });

      return NextResponse.json({
        success: true,
        data: {
          id: wedding.id,
          slug: wedding.slug,
          groomName: wedding.groomName,
          brideName: wedding.brideName,
        },
      });
    }

    // Compare passwords
    if (wedding.clientPassword !== password) {
      return NextResponse.json(
        { success: false, error: 'كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // Set auth cookie
    const cookieStore = await cookies();
    cookieStore.set(`zafati_client_${slug}`, 'authenticated', {
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: 'lax',
      path: '/',
    });

    return NextResponse.json({
      success: true,
      data: {
        id: wedding.id,
        slug: wedding.slug,
        groomName: wedding.groomName,
        brideName: wedding.brideName,
      },
    });
  } catch (error) {
    console.error('Client auth error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في المصادقة' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const cookie = cookieStore.get(`zafati_client_${slug}`);

    return NextResponse.json({
      authenticated: !!cookie?.value,
    });
  } catch (error) {
    console.error('Client auth check error:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { success: false },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.delete(`zafati_client_${slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Client auth delete error:', error);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
