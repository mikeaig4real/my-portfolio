import { NextResponse } from 'next/server';
import config from '@/config';
import { STORAGE_KEYS } from '@/lib/constants';
import { validateRequest } from '@/lib/schemas/validateRequest';
import { LoginInputSchema } from '@/lib/schemas/portfolioSchema';
import { ApiResponse } from '@/lib/apiResponse';
import { checkRateLimit, createRateLimitResponse } from '@/lib/rateLimit';

export async function POST(request: Request) {
  // Brute-force protection: Max 5 login attempts per 15 minutes per IP
  const rateLimitResult = checkRateLimit(request, {
    keyPrefix: 'auth_login',
    intervalMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  });

  if (!rateLimitResult.success) {
    return createRateLimitResponse(
      rateLimitResult,
      'Too many failed login attempts. For security, please wait 15 minutes before trying again.'
    );
  }

  const validation = await validateRequest(request, LoginInputSchema);
  if (!validation.success) {
    return validation.errorResponse;
  }

  const { password } = validation.data;
  if (password !== config.security.adminPassword) {
    return ApiResponse.unauthorized('Invalid admin passcode.');
  }

  const response = NextResponse.json({
    success: true,
    message: 'Admin authenticated successfully',
  });

  response.cookies.set(STORAGE_KEYS.ADMIN_SESSION, config.security.adminSessionTokenValue, {
    httpOnly: true,
    secure: config.app.env === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}
