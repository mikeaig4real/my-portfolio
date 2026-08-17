import { NextResponse } from 'next/server';

interface RateLimitOptions {
  keyPrefix?: string;
  intervalMs?: number; // Time window in milliseconds (default 60,000ms = 1 min)
  maxRequests?: number; // Max allowed hits in the window
}

interface RateLimitRecord {
  timestamps: number[];
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number; // Timestamp in ms when the earliest slot resets
  retryAfterSeconds: number;
}

// In-memory sliding window bucket store
const store = new Map<string, RateLimitRecord>();

// Periodic garbage collection every 60 seconds to prune expired buckets
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 900000); // keep up to 15m max window
      if (record.timestamps.length === 0) {
        store.delete(key);
      }
    }
  }, 60000);
}

/**
 * Extracts client IP address accurately from standard reverse proxy and cloud headers.
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;

  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();

  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(',')[0]?.trim();
    if (firstIp) return firstIp;
  }

  const xRealIp = headers.get('x-real-ip');
  if (xRealIp) return xRealIp.trim();

  return '127.0.0.1';
}

/**
 * Sliding window rate limiter.
 */
export function checkRateLimit(
  request: Request,
  options: RateLimitOptions = {}
): RateLimitResult {
  const {
    keyPrefix = 'global',
    intervalMs = 60000, // 1 minute window
    maxRequests = 30, // 30 requests per minute default
  } = options;

  const ip = getClientIp(request);
  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();
  const windowStart = now - intervalMs;

  const record = store.get(key) || { timestamps: [] };

  // Filter timestamps within current sliding window
  const activeTimestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (activeTimestamps.length >= maxRequests) {
    const earliestTimestamp = activeTimestamps[0] || now;
    const resetTime = earliestTimestamp + intervalMs;
    const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - now) / 1000));

    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetTime,
      retryAfterSeconds,
    };
  }

  // Record this hit
  activeTimestamps.push(now);
  store.set(key, { timestamps: activeTimestamps });

  const remaining = Math.max(0, maxRequests - activeTimestamps.length);
  const earliestTimestamp = activeTimestamps[0] || now;
  const resetTime = earliestTimestamp + intervalMs;
  const retryAfterSeconds = 0;

  return {
    success: true,
    limit: maxRequests,
    remaining,
    resetTime,
    retryAfterSeconds,
  };
}

/**
 * Standard HTTP 429 Too Many Requests response with standard rate-limit headers.
 */
export function createRateLimitResponse(
  result: RateLimitResult,
  customMessage?: string
): NextResponse {
  const message =
    customMessage ||
    `Rate limit exceeded. Please wait ${result.retryAfterSeconds} second(s) before trying again.`;

  return NextResponse.json(
    {
      success: false,
      error: message,
      retryAfter: result.retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(Math.ceil(result.resetTime / 1000)),
        'Retry-After': String(result.retryAfterSeconds),
      },
    }
  );
}
