import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import WeddingPageClient from '@/components/wedding/WeddingPageClient';
import { parseGalleryImages } from '@/lib/wedding-utils';
import { incrementVisitCount } from '@/lib/db-helpers';
import type { Wedding } from '@/types/wedding';

interface WeddingPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ guest?: string }>;
}

export async function generateMetadata({ params }: WeddingPageProps): Promise<Metadata> {
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
        locale: 'ar_EG',
      },
    };
  } catch {
    return { title: 'دعوة زفاف' };
  }
}

export default async function WeddingPage({ params, searchParams }: WeddingPageProps) {
  const { slug } = await params;
  const { guest } = await searchParams;

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
    updatedAt: weddingRow.updatedAt.toISOString(),
  };

  // Increment visit count
  if (wedding) {
    await incrementVisitCount(wedding.id);
  }

  // Decode guest name from URL
  const guestName = guest ? decodeURIComponent(guest) : undefined;

  return <WeddingPageClient wedding={wedding} guestName={guestName} />;
}
