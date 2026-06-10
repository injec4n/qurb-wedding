import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { verifyAdminAuth } from '@/lib/auth-helpers';
import { supabase, STORAGE_BUCKET, isSupabaseConfigured } from '@/lib/supabase';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_MUSIC_SIZE = 20 * 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/svg+xml'];
const MUSIC_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'];

export async function POST(request: NextRequest) {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ success: false, error: 'لا يوجد ملف' }, { status: 400 });
    }

    const isImage = IMAGE_TYPES.includes(file.type) || file.name.match(/\.(jpg|jpeg|png|webp|gif|jfif|bmp|svg)$/i);
    const isMusic = MUSIC_TYPES.includes(file.type) || file.name.match(/\.(mp3|wav|ogg)$/i);
    if (!isImage && !isMusic) {
      return NextResponse.json({ success: false, error: 'نوع الملف غير مدعوم' }, { status: 400 });
    }

    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_MUSIC_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: 'حجم الملف كبير جداً' }, { status: 400 });
    }

    const ext = path.extname(file.name) || (isImage ? '.jpg' : '.mp3');
    const filename = `${randomUUID()}${ext}`;
    const subdir = isImage ? 'images' : 'music';
    const storagePath = `${subdir}/${filename}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    let url = '';

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(storagePath, buffer, {
        contentType: file.type || (isImage ? 'image/jpeg' : 'audio/mpeg'),
        upsert: false,
      });
      if (error) {
        console.error('Supabase upload error:', error);
        url = await uploadLocal(buffer, subdir, filename);
      } else {
        const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);
        url = urlData.publicUrl;
      }
    } else {
      url = await uploadLocal(buffer, subdir, filename);
    }

    return NextResponse.json({ success: true, data: { url, filename, size: file.size } });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'فشل في رفع الملف' }, { status: 500 });
  }
}

async function uploadLocal(buffer: Buffer, subdir: string, filename: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', subdir);
  await mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);
  return `/uploads/${subdir}/${filename}`;
}
