import { connectToDatabase } from '@/lib/mongodb';
import Analytics from '@/models/Analytics';
import { cookies } from 'next/headers';
import { validateRequest } from '@/lib/schemas/validateRequest';
import { AnalyticsInputSchema } from '@/lib/schemas/portfolioSchema';
import { ANALYTICS_EVENTS, STORAGE_KEYS, APP_CONSTANTS } from '@/lib/constants';
import { ApiResponse } from '@/lib/apiResponse';
import { parseUserAgent, getGeoIpInfo } from '@/lib/visitorIntelligence';

export async function POST(request: Request) {
  const validation = await validateRequest(request, AnalyticsInputSchema);
  if (!validation.success) {
    return validation.errorResponse;
  }

  const { type, details, screen, language } = validation.data;
  const targetId = details;
  const userAgent = request.headers.get('user-agent') || 'unknown';

  const rawIp =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    '127.0.0.1';

  const clientIp = rawIp.trim();
  const { browser, os, device } = parseUserAgent(userAgent);
  const geoInfo = await getGeoIpInfo(clientIp);

  try {
    await connectToDatabase();

    let doc = await Analytics.findOne();
    if (!doc) {
      doc = await Analytics.create({});
    }

    if (type === ANALYTICS_EVENTS.PAGE_VIEW) {
      doc.totalViews = (doc.totalViews || 0) + 1;
    } else if (type === ANALYTICS_EVENTS.RESUME_DOWNLOAD) {
      doc.totalResumeDownloads = (doc.totalResumeDownloads || 0) + 1;
    } else if (type === ANALYTICS_EVENTS.CONTACT_CLICK) {
      doc.totalContactClicks = (doc.totalContactClicks || 0) + 1;
    } else if (type === ANALYTICS_EVENTS.PROJECT_CLICK && targetId) {
      const current = doc.projectClicks.get(targetId) || 0;
      doc.projectClicks.set(targetId, current + 1);
    }

    doc.recentEvents.unshift({
      type,
      targetId,
      timestamp: new Date(),
      userAgent: userAgent.slice(0, 100),
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
    });

    if (doc.recentEvents.length > APP_CONSTANTS.MAX_RECENT_EVENTS) {
      doc.recentEvents = doc.recentEvents.slice(0, APP_CONSTANTS.MAX_RECENT_EVENTS);
    }

    await doc.save();
    return ApiResponse.success();
  } catch {
    return ApiResponse.serverError();
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(STORAGE_KEYS.ADMIN_SESSION)?.value;

  if (session !== STORAGE_KEYS.ADMIN_SESSION_VALUE) {
    return ApiResponse.unauthorized();
  }

  try {
    await connectToDatabase();
    const doc = await Analytics.findOne().lean();

    if (!doc) {
      return ApiResponse.success({
        totalViews: 0,
        totalResumeDownloads: 0,
        totalContactClicks: 0,
        projectClicks: {},
        recentEvents: [],
      });
    }

    return ApiResponse.success(doc);
  } catch {
    return ApiResponse.serverError('Failed to fetch analytics.');
  }
}
