import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supabase, STORAGE_BUCKET, isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  try {
    const storageResults: string[] = [];
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(b => b.name === STORAGE_BUCKET);
        if (!bucketExists) {
          const { error: createError } = await supabase.storage.createBucket(STORAGE_BUCKET, {
            public: true,
            fileSizeLimit: '20MB',
          });
          if (createError) {
            storageResults.push('Storage bucket error: ' + createError.message);
          } else {
            storageResults.push('Storage bucket "' + STORAGE_BUCKET + '" created successfully');
          }
        } else {
          storageResults.push('Storage bucket "' + STORAGE_BUCKET + '" already exists');
        }
      } catch (storageErr: unknown) {
        const err = storageErr as Error;
        storageResults.push('Storage setup error: ' + err.message);
      }
    } else {
      storageResults.push('Supabase not configured - skipping storage setup');
    }

    const statements = [
      `CREATE TABLE IF NOT EXISTS "Wedding" (
        "id" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "groomName" TEXT NOT NULL,
        "brideName" TEXT NOT NULL,
        "weddingDate" TEXT NOT NULL,
        "weddingTime" TEXT NOT NULL,
        "venueName" TEXT NOT NULL,
        "venueAddress" TEXT NOT NULL DEFAULT '',
        "googleMapsLink" TEXT NOT NULL DEFAULT '',
        "welcomeMessage" TEXT NOT NULL DEFAULT '',
        "contactPhone" TEXT NOT NULL DEFAULT '',
        "coverImage" TEXT NOT NULL DEFAULT '',
        "coverCategory" TEXT NOT NULL DEFAULT '',
        "couplePhoto" TEXT NOT NULL DEFAULT '',
        "galleryImages" TEXT NOT NULL DEFAULT '[]',
        "backgroundMusicUrl" TEXT NOT NULL DEFAULT '',
        "clientPassword" TEXT NOT NULL DEFAULT '',
        "theme" TEXT NOT NULL DEFAULT 'classic-gold',
        "colorPreset" TEXT NOT NULL DEFAULT '',
        "primaryColor" TEXT NOT NULL DEFAULT '#D4A853',
        "secondaryColor" TEXT NOT NULL DEFAULT '#1A1A2E',
        "backgroundColor" TEXT NOT NULL DEFAULT '#0D0D1A',
        "textColor" TEXT NOT NULL DEFAULT '#FFFFFF',
        "buttonColor" TEXT NOT NULL DEFAULT '#D4A853',
        "accentColor" TEXT NOT NULL DEFAULT '#E8C874',
        "enableRsvp" BOOLEAN NOT NULL DEFAULT true,
        "enableGallery" BOOLEAN NOT NULL DEFAULT true,
        "enableCountdown" BOOLEAN NOT NULL DEFAULT true,
        "enableMusic" BOOLEAN NOT NULL DEFAULT true,
        "enableGuestPersonalization" BOOLEAN NOT NULL DEFAULT true,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "bismallahText" TEXT NOT NULL DEFAULT '',
        "invitationTitle" TEXT NOT NULL DEFAULT '',
        "heroSubtitle" TEXT NOT NULL DEFAULT '',
        "heroSubSubtitle" TEXT NOT NULL DEFAULT '',
        "detailsTitle" TEXT NOT NULL DEFAULT '',
        "detailsSubtitle" TEXT NOT NULL DEFAULT '',
        "venueTitle" TEXT NOT NULL DEFAULT '',
        "rsvpTitle" TEXT NOT NULL DEFAULT '',
        "rsvpAttendingText" TEXT NOT NULL DEFAULT '',
        "rsvpNotAttendingText" TEXT NOT NULL DEFAULT '',
        "cardInvitationText" TEXT NOT NULL DEFAULT '',
        "guestWelcomeText" TEXT NOT NULL DEFAULT '',
        "guestSubWelcomeText" TEXT NOT NULL DEFAULT '',
        "visitCount" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Wedding_pkey" PRIMARY KEY ("id")
      );`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "Wedding_slug_key" ON "Wedding"("slug");`,
      `CREATE TABLE IF NOT EXISTS "Guest" (
        "id" TEXT NOT NULL,
        "weddingId" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "phone" TEXT NOT NULL DEFAULT '',
        "guestLink" TEXT NOT NULL DEFAULT '',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
      );`,
      `CREATE TABLE IF NOT EXISTS "RsvpResponse" (
        "id" TEXT NOT NULL,
        "weddingId" TEXT NOT NULL,
        "guestId" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "message" TEXT NOT NULL DEFAULT '',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "RsvpResponse_pkey" PRIMARY KEY ("id")
      );`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "RsvpResponse_guestId_key" ON "RsvpResponse"("guestId");`,
      `CREATE TABLE IF NOT EXISTS "Settings" (
        "id" TEXT NOT NULL,
        "key" TEXT NOT NULL,
        "value" TEXT NOT NULL,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
      );`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "Settings_key_key" ON "Settings"("key");`,
      `CREATE TABLE IF NOT EXISTS "Review" (
        "id" TEXT NOT NULL,
        "type" TEXT NOT NULL DEFAULT 'text',
        "name" TEXT NOT NULL,
        "rating" INTEGER NOT NULL DEFAULT 5,
        "text" TEXT NOT NULL DEFAULT '',
        "imageUrl" TEXT NOT NULL DEFAULT '',
        "audioUrl" TEXT NOT NULL DEFAULT '',
        "weddingName" TEXT NOT NULL DEFAULT '',
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "order" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
      );`,
      `ALTER TABLE "Guest" DROP CONSTRAINT IF EXISTS "Guest_weddingId_fkey";`,
      `ALTER TABLE "Guest" ADD CONSTRAINT "Guest_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;`,
      `ALTER TABLE "RsvpResponse" DROP CONSTRAINT IF EXISTS "RsvpResponse_weddingId_fkey";`,
      `ALTER TABLE "RsvpResponse" ADD CONSTRAINT "RsvpResponse_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;`,
      `ALTER TABLE "RsvpResponse" DROP CONSTRAINT IF EXISTS "RsvpResponse_guestId_fkey";`,
      `ALTER TABLE "RsvpResponse" ADD CONSTRAINT "RsvpResponse_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;`,
    ];

    const results: string[] = [];
    for (const sql of statements) {
      try {
        await db.$executeRawUnsafe(sql);
        results.push('OK: ' + sql.substring(0, 50).replace(/\n/g, ' ') + '...');
      } catch (e: unknown) {
        const error = e as Error;
        if (error.message?.includes('already exists')) {
          results.push('SKIP: ' + sql.substring(0, 50).replace(/\n/g, ' ') + '...');
        } else {
          results.push('ERROR: ' + error.message?.substring(0, 80));
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database tables created!',
      storage: storageResults,
      details: results,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
