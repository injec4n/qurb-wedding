import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_MUSIC_SIZE = 20 * 1024 * 1024; // 20MB

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/svg+xml'];
const MUSIC_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'لا يوجد ملف' }, { status: 400 });
    }

    // Determine file type (image or music)
    const isImage = IMAGE_TYPES.includes(file.type) || file.name.match(/\.(jpg|jpeg|png|webp|gif|jfif|bmp|svg)$/i);
    const isMusic = MUSIC_TYPES.includes(file.type) || file.name.match(/\.(mp3|wav|ogg)$/i);

    if (!isImage && !isMusic) {
      return NextResponse.json({ success: false, error: 'نوع الملف غير مدعوم' }, { status: 400 });
    }

    // Size check
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_MUSIC_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `حجم الملف كبير جداً (الحد الأقصى ${isImage ? '10' : '20'}MB)` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const ext = path.extname(file.name) || (isImage ? '.jpg' : '.mp3');
    const filename = `${randomUUID()}${ext}`;
    const subdir = isImage ? 'images' : 'music';
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', subdir);

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    // Write file
    const filePath = path.join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Return the public URL
    const url = `/uploads/${subdir}/${filename}`;

    return NextResponse.json({
      success: true,
      data: { url, filename, size: file.size },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'فشل في رفع الملف' }, { status: 500 });
  }
}
