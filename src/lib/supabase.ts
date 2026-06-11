const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export function isSupabaseConfigured(): boolean {
  return !!(SUPABASE_URL && SUPABASE_SERVICE_KEY);
}

export const STORAGE_BUCKET = 'wedding-uploads';
export const supabaseUrl = SUPABASE_URL;
export const supabaseServiceKey = SUPABASE_SERVICE_KEY;

export const supabase = isSupabaseConfigured()
  ? {
      storage: {
        listBuckets: async () => {
          const res = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
            headers: { Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`, apikey: SUPABASE_SERVICE_KEY },
          });
          const data = await res.json();
          return { data, error: null };
        },
        createBucket: async (name: string, options: { public: boolean; fileSizeLimit: string }) => {
          const res = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
              apikey: SUPABASE_SERVICE_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, public: options.public, file_size_limit: options.fileSizeLimit }),
          });
          const data = await res.json();
          return { data, error: res.ok ? null : data };
        },
      },
    }
  : null;