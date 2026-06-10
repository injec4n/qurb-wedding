import { cookies } from 'next/headers';

const ADMIN_COOKIE = 'zafati_admin_auth';

export async function verifyAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const auth = cookieStore.get(ADMIN_COOKIE);
    return auth?.value === 'authenticated';
  } catch {
    return false;
  }
}
