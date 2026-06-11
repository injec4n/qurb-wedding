import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import WeddingPageClient from '@/components/wedding/WeddingPageClient';
import { parseGalleryImages } from '@/lib/wedding-utils';
import { incrementVisitCount } from '@/lib/db-helpers';
import type { Wedding } from '@/types/wedding';

interface WeddingPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ guest?: string; g?: string }>;
}

export async function generateMetadata({
  params
}: WeddingPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const wedding = await db.wedding.findUnique({ where: { slug } });

    if (!wedding) {
      return { title: 'الدعوة غير موجودة' };
    }

    return {
      title: `دعوة زفاف ${wedding.groomName} و ${wedding.brideName}`,
      description: `يتشرفان بدعوتكم لحضور حفل زفافهما - ${wedding.venueName}`,
      openGraph: {
        title: `دعوة زفاف ${wedding.groomName} و ${wedding.brideName}`,
        description: `يتشرفان بدعوتكم لحضور حفل زفافهما`,
        images: wedding.coverImage ? [wedding.coverImage] : undefined,
        type: 'website',
        locale: 'ar_EG'
      }
    };
  } catch {
    return { title: 'دعوة زفاف' };
  }
}

export default async function WeddingPage({
  params,
  searchParams
}: WeddingPageProps) {
  const { slug } = await params;
  const { guest, g } = await searchParams;

  const weddingRow = await db.wedding.findUnique({ where: { slug } });

  if (!weddingRow || !weddingRow.isActive) {
    notFound();
  }

  // Transform DB row to Wedding type (galleryImages: string[] → array)
  const wedding: Wedding = {
    ...weddingRow,
    galleryImages: parseGalleryImages(weddingRow.galleryImages),
    weddingDate: weddingRow.weddingDate,
    weddingTime: weddingRow.weddingTime,
    createdAt: weddingRow.createdAt.toISOString(),
    updatedAt: weddingRow.updatedAt.toISOString()
  };

  // Increment visit count
  if (wedding) {
    await incrementVisitCount(wedding.id);
  }

  // Resolve guest name:
  // Priority 1: ?g=TOKEN — look up guest by short token (clean links)
  // Priority 2: ?guest=NAME — decode from URL (backward compatible)
  let guestName: string | undefined;
  let guestToken: string | undefined;

  if (g) {
    const guestRecord = await db.guest.findFirst({
      where: {
        OR: [{ guestToken: g }, { guestLink: g }]
      },
      select: { name: true, guestToken: true }
    });
    if (guestRecord) {
      guestName = guestRecord.name;
      guestToken = guestRecord.guestToken;
    }
  } else if (guest) {
    // Legacy name-based lookup (backward compatible)
    guestName = decodeURIComponent(guest);
  }

  return (
    <WeddingPageClient
      wedding={wedding}
      guestName={guestName}
      guestToken={guestToken}
    />
  );
}
