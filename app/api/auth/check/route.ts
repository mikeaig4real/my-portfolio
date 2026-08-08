import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import config from '@/config';
import { STORAGE_KEYS } from '@/lib/constants';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(STORAGE_KEYS.ADMIN_SESSION)?.value;

  if (session && session === config.security.adminSessionTokenValue) {
    return NextResponse.json({ authenticated: true, success: true });
  }

  return NextResponse.json({ authenticated: false, success: false }, { status: 401 });
}
