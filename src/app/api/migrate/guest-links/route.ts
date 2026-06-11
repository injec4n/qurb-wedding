import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateGuestToken } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const adminAuth = request.cookies.get('qurb_admin');
    if (!adminAuth?.value) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const allGuests = await db.guest.findMany({
      select: { id: true, guestLink: true, guestToken: true }
    });

    const guestsToMigrate = allGuests.filter(
      g =>
        g.guestLink.includes('%') ||
        g.guestLink === '' ||
        g.guestLink !== g.guestToken
    );

    if (guestsToMigrate.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'لا يوجد ضيوف يحتاجون تحديث',
        migrated: 0
      });
    }

    let migrated = 0;
    for (const guest of guestsToMigrate) {
      let token = generateGuestToken();
      let existing = await db.guest.findUnique({
        where: { guestToken: token }
      });
      let attempts = 0;
      while (existing && attempts < 10) {
        token = generateGuestToken();
        existing = await db.guest.findUnique({ where: { guestToken: token } });
        attempts++;
      }

      await db.guest.update({
        where: { id: guest.id },
        data: {
          guestLink: token,
          guestToken: token
        }
      });
      migrated++;
    }

    return NextResponse.json({
      success: true,
      message: `تم تحديث ${migrated} ضيف بنجاح`,
      migrated,
      total: allGuests.length
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث بيانات الضيوف' },
      { status: 500 }
    );
  }
}
