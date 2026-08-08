import { NextResponse } from 'next/server';
import { STORAGE_KEYS } from '@/lib/constants';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });

  response.cookies.set(STORAGE_KEYS.ADMIN_SESSION, '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  return response;
}
