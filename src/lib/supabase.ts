const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const STORAGE_BUCKET = 'wedding-uploads';

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseServiceKey);
}

export async function supabaseUpload(storagePath: string, buffer: Buffer, contentType: string): Promise<string> {
  if (!isSupabaseConfigured()) throw new Error('Supabase not configured');

  const url = `${supabaseUrl}/storage/v1/object/${STORAGE_BUCKET}/${storagePath}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'apikey': supabaseServiceKey,
      'Content-Type': contentType,
    },
    body: buffer,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error('Supabase upload failed: ' + error);
  }

  return `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${storagePath}`;
}

export async function supabaseListBuckets(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];

  const url = `${supabaseUrl}/storage/v1/bucket`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'apikey': supabaseServiceKey,
    },
  });

  if (!response.ok) return [];
  const buckets = await response.json();
  return buckets.map((b: { name: string }) => b.name);
}

export async function supabaseCreateBucket(name: string, isPublic: boolean): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const url = `${supabaseUrl}/storage/v1/bucket`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'apikey': supabaseServiceKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, public: isPublic, file_size_limit: '20000000' }),
  });

  return response.ok;
}
