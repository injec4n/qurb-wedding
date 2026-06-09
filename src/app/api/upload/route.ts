import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const AUDIO_EXTENSIONS = ['mp3', 'wav', 'ogg'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_AUDIO_SIZE = 20 * 1024 * 1024; // 20MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const originalName = file.name;
    const extension = originalName.split('.').pop()?.toLowerCase();

    if (!extension) {
      return NextResponse.json(
        { success: false, error: 'File must have an extension' },
        { status: 400 }
      );
    }

    const isImage = IMAGE_EXTENSIONS.includes(extension);
    const isAudio = AUDIO_EXTENSIONS.includes(extension);

    if (!isImage && !isAudio) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file type: .${extension}. Supported types: ${[
            ...IMAGE_EXTENSIONS,
            ...AUDIO_EXTENSIONS,
          ].join(', ')}`,
        },
        { status: 400 }
      );
    }

    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_AUDIO_SIZE;
    const fileTypeLabel = isImage ? 'image' : 'audio';
    const maxLabel = isImage ? '10MB' : '20MB';

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: `${fileTypeLabel.charAt(0).toUpperCase() + fileTypeLabel.slice(1)} file size exceeds the maximum allowed size of ${maxLabel}`,
        },
        { status: 400 }
      );
    }

    const uniqueId = crypto.randomUUID();
    const filename = `${uniqueId}.${extension}`;

    const subDir = isImage ? 'images' : 'music';
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', subDir);
    const filePath = path.join(uploadDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${subDir}/${filename}`;

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        filename,
        originalName,
        size: file.size,
        type: fileTypeLabel,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
