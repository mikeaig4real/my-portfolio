import { cookies } from 'next/headers';
import { validateRequest } from '@/lib/schemas/validateRequest';
import { AnalyticsInputSchema, AnalyticsDeleteInputSchema } from '@/lib/schemas/portfolioSchema';
import { STORAGE_KEYS } from '@/lib/constants';
import { ApiResponse } from '@/lib/apiResponse';
import { parseUserAgent, getGeoIpInfo } from '@/lib/visitorIntelligence';
import {
  getAnalyticsUnified,
  recordAnalyticsEventUnified,
  deleteAnalyticsUnified,
} from '@/lib/db/analyticsDb';
import { checkRateLimit, createRateLimitResponse } from '@/lib/rateLimit';

export async function POST(request: Request) {
  // Analytics Telemetry Rate Limiting: Max 120 beacon events per minute per IP
  const rateLimitResult = checkRateLimit(request, {
    keyPrefix: 'analytics_post',
    intervalMs: 60 * 1000,
    maxRequests: 120,
  });

  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult, 'Too many analytics beacons recorded.');
  }

  const validation = await validateRequest(request, AnalyticsInputSchema);
  if (!validation.success) {
    return validation.errorResponse;
  }


  const {
    id,
    type,
    visitorId,
    visitCount,
    targetId,
    targetTitle,
    details,
    screen,
    language,
    duration,
    scrollDepth,
    section,
  } = validation.data;

  const eventId = id || `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const userAgent = request.headers.get('user-agent') || 'unknown';

  const rawIp =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    '127.0.0.1';

  const clientIp = rawIp.trim();
  const { browser, os, device } = parseUserAgent(userAgent);
  const geoInfo = await getGeoIpInfo(clientIp);

  const newEvent = {
    id: eventId,
    type,
    visitorId: visitorId || 'anonymous',
    visitCount: visitCount || 1,
    targetId: targetId || details,
    targetTitle: targetTitle || '',
    timestamp: new Date(),
    userAgent: userAgent.slice(0, 120),
    ip: clientIp,
    country: geoInfo.country,
    city: geoInfo.city,
    region: geoInfo.region,
    isp: geoInfo.isp,
    browser,
    os,
    device,
    screen: screen || '1920x1080',
    language: language || 'en',
    duration: duration || 0,
    scrollDepth: scrollDepth || 0,
    section: section || '',
    details: details || '',
  };

  try {
    const result = await recordAnalyticsEventUnified(newEvent);
    return ApiResponse.success(result);
  } catch {
    return ApiResponse.serverError('Failed to record analytics event.');
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(STORAGE_KEYS.ADMIN_SESSION)?.value;

  if (session !== STORAGE_KEYS.ADMIN_SESSION_VALUE) {
    return ApiResponse.unauthorized();
  }

  try {
    const data = await getAnalyticsUnified();
    return ApiResponse.success(data);
  } catch {
    return ApiResponse.serverError('Failed to fetch analytics.');
  }
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get(STORAGE_KEYS.ADMIN_SESSION)?.value;

  if (session !== STORAGE_KEYS.ADMIN_SESSION_VALUE) {
    return ApiResponse.unauthorized();
  }

  const validation = await validateRequest(request, AnalyticsDeleteInputSchema);
  if (!validation.success) {
    return validation.errorResponse;
  }

  const { action, id, visitorId } = validation.data;

  try {
    await deleteAnalyticsUnified(action, id, visitorId);
    return ApiResponse.success({ action, id, visitorId }, 'Analytics deletion completed successfully.');
  } catch {
    return ApiResponse.serverError('Failed to delete analytics.');
  }
}

