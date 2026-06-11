import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_ENDPOINT = process.env.R2_ENDPOINT || '';
const R2_BUCKET = process.env.R2_BUCKET_NAME || 'qurb-uploads';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

export function isR2Configured(): boolean {
  return !!(R2_ACCESS_KEY && R2_SECRET_KEY && R2_ENDPOINT);
}

const r2Client = isR2Configured()
  ? new S3Client({
      region: 'auto',
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY,
        secretAccessKey: R2_SECRET_KEY,
      },
    })
  : null;

export async function r2Upload(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  if (!r2Client) {
    throw new Error('R2 is not configured');
  }

  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return `${R2_PUBLIC_URL}/${key}`;
}