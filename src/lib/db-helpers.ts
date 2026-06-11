import { db } from '@/lib/db';
import { generateGuestToken } from '@/lib/utils';
import { Wedding, Guest, RsvpResponse } from '@/types/wedding';

export async function getWeddingBySlug(slug: string): Promise<Wedding | null> {
  const wedding = await db.wedding.findUnique({
    where: { slug }
  });
  if (!wedding) return null;
  return {
    ...wedding,
    galleryImages: wedding.galleryImages as unknown as string[],
    theme: wedding.theme as Wedding['theme']
  } as Wedding;
}

export async function getAllWeddings(): Promise<Wedding[]> {
  const weddings = await db.wedding.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return weddings.map(w => ({
    ...w,
    galleryImages: w.galleryImages as unknown as string[],
    theme: w.theme as Wedding['theme']
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
    data
  });
}

export async function deleteWedding(id: string) {
  return db.wedding.delete({
    where: { id }
  });
}

export async function getGuestsByWedding(weddingId: string): Promise<Guest[]> {
  return db.guest.findMany({
    where: { weddingId },
    orderBy: { createdAt: 'desc' }
  }) as Promise<Guest[]>;
}

export async function addGuest(
  weddingId: string,
  name: string,
  phone: string = ''
) {
  const guestToken = generateGuestToken();
  return db.guest.create({
    data: {
      weddingId,
      name,
      phone,
      guestLink: guestToken,
      guestToken
    }
  });
}

export async function getRsvpsByWedding(
  weddingId: string
): Promise<RsvpResponse[]> {
  return db.rsvpResponse.findMany({
    where: { weddingId },
    include: { guest: true },
    orderBy: { createdAt: 'desc' }
  }) as unknown as Promise<RsvpResponse[]>;
}

export async function submitRsvp(
  weddingId: string,
  guestId: string,
  status: string,
  message: string = ''
) {
  return db.rsvpResponse.upsert({
    where: { guestId },
    update: { status, message },
    create: { weddingId, guestId, status, message }
  });
}

export async function incrementVisitCount(id: string) {
  const wedding = await db.wedding.findUnique({ where: { id } });
  if (!wedding) {
    throw new Error('Wedding not found');
  }
  return db.wedding.update({
    where: { id },
    data: { visitCount: { increment: 1 } }
  });
}

export async function getWeddingStats(id: string) {
  const wedding = await db.wedding.findUnique({
    where: { id },
    select: { visitCount: true }
  });

  if (!wedding) {
    throw new Error('Wedding not found');
  }

  const guests = await db.guest.findMany({
    where: { weddingId: id },
    include: { rsvp: true }
  });

  const totalGuests = guests.length;
  const attending = guests.filter(g => g.rsvp?.status === 'attending').length;
  const notAttending = guests.filter(
    g => g.rsvp?.status === 'not-attending'
  ).length;
  const pending = guests.filter(
    g => !g.rsvp || g.rsvp?.status === 'pending'
  ).length;

  return {
    visitCount: wedding.visitCount,
    totalGuests,
    attending,
    notAttending,
    pending
  };
}
