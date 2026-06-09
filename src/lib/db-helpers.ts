import { db } from '@/lib/db';
import { Wedding, Guest, RsvpResponse } from '@/types/wedding';

export async function getWeddingBySlug(slug: string): Promise<Wedding | null> {
  const wedding = await db.wedding.findUnique({
    where: { slug },
  });
  if (!wedding) return null;
  return {
    ...wedding,
    galleryImages: wedding.galleryImages as unknown as string[],
    theme: wedding.theme as Wedding['theme'],
  } as Wedding;
}

export async function getAllWeddings(): Promise<Wedding[]> {
  const weddings = await db.wedding.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return weddings.map(w => ({
    ...w,
    galleryImages: w.galleryImages as unknown as string[],
    theme: w.theme as Wedding['theme'],
  })) as Wedding[];
}

export async function createWedding(data: {
  slug: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress?: string;
  googleMapsLink?: string;
  welcomeMessage?: string;
  contactPhone?: string;
  coverImage?: string;
  galleryImages?: string;
  backgroundMusicUrl?: string;
  theme?: string;
  colorPreset?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  accentColor?: string;
  enableRsvp?: boolean;
  enableGallery?: boolean;
  enableCountdown?: boolean;
  enableMusic?: boolean;
  enableGuestPersonalization?: boolean;
}) {
  return db.wedding.create({ data });
}

export async function updateWedding(id: string, data: Record<string, unknown>) {
  return db.wedding.update({
    where: { id },
    data,
  });
}

export async function deleteWedding(id: string) {
  return db.wedding.delete({
    where: { id },
  });
}

export async function getGuestsByWedding(weddingId: string): Promise<Guest[]> {
  return db.guest.findMany({
    where: { weddingId },
    orderBy: { createdAt: 'desc' },
  }) as Promise<Guest[]>;
}

export async function addGuest(weddingId: string, name: string, phone: string = '') {
  const guestLink = encodeURIComponent(name.trim());
  return db.guest.create({
    data: {
      weddingId,
      name,
      phone,
      guestLink,
    },
  });
}

export async function getRsvpsByWedding(weddingId: string): Promise<RsvpResponse[]> {
  return db.rsvpResponse.findMany({
    where: { weddingId },
    include: { guest: true },
    orderBy: { createdAt: 'desc' },
  }) as unknown as Promise<RsvpResponse[]>;
}

export async function submitRsvp(weddingId: string, guestId: string, status: string, message: string = '') {
  return db.rsvpResponse.upsert({
    where: { guestId },
    update: { status, message },
    create: { weddingId, guestId, status, message },
  });
}
