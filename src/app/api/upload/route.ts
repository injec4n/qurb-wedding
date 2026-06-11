import { NextRequest, NextResponse } from 'next/server';
import { r2Upload, isR2Configured } from '@/lib/r2';
import { supabaseUpload, isSupabaseConfigured } from '@/lib/supabase-upload';
import { verifyAdminAuth } from '@/lib/auth-helpers';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_MUSIC_SIZE = 20 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_MUSIC_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac'];

export async function POST(request: NextRequest) {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'لم يتم اختيار ملف' }, { status: 400 });
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isMusic = ALLOWED_MUSIC_TYPES.includes(file.type);

    if (!isImage && !isMusic) {
      return NextResponse.json(
        { success: false, error: 'نوع الملف غير مدعوم' },
        { status: 400 }
      );
    }

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ success: false, error: 'حجم الصورة يجب أن يكون أقل من 10MB' }, { status: 400 });
    }

    if (isMusic && file.size > MAX_MUSIC_SIZE) {
      return NextResponse.json({ success: false, error: 'حجم الملف الصوتي يجب أن يكون أقل من 20MB' }, { status: 400 });
    }

    const ext = path.extname(file.name) || (isImage ? '.jpg' : '.mp3');
    const folder = isImage ? 'images' : 'music';
    const filename = `${folder}/${uuidv4()}${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let url = '';

    if (isR2Configured()) {
      try {
        url = await r2Upload(buffer, filename, file.type);
      } catch (r2Error) {
        console.error('R2 upload failed, trying Supabase:', r2Error);
      }
    }

    if (!url && isSupabaseConfigured()) {
      try {
        url = await supabaseUpload(buffer, filename, file.type);
      } catch (supabaseError) {
        console.error('Supabase upload failed:', supabaseError);
      }
    }

    if (!url) {
      const uploadDir = path.join(process.cwd(), 'public', 'upload');
      const filePath = path.join(uploadDir, filename);
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, buffer);
      url = `/upload/${filename}`;
    }

    return NextResponse.json({ success: true, data: { url, filename } });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Upload error:', err);
    return NextResponse.json({ success: false, error: 'فشل في رفع الملف' }, { status: 500 });
  }
}