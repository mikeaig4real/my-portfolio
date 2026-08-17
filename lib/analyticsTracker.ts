'use client';

import { ANALYTICS_EVENTS, STORAGE_KEYS } from '@/lib/constants';

interface VisitorInfo {
  visitorId: string;
  visitCount: number;
  isReturning: boolean;
}

export function getVisitorInfo(): VisitorInfo {
  if (typeof window === 'undefined') {
    return { visitorId: 'server', visitCount: 1, isReturning: false };
  }

  let visitorId = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
  if (!visitorId) {
    visitorId = `vid_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    try {
      localStorage.setItem(STORAGE_KEYS.VISITOR_ID, visitorId);
    } catch {}
  }

  let visitCount = 1;
  const storedCount = localStorage.getItem(STORAGE_KEYS.VISITOR_VISIT_COUNT);
  const lastActiveStr = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE_TS);
  const now = Date.now();

  if (storedCount && lastActiveStr) {
    const lastActive = parseInt(lastActiveStr, 10);
    const THIRTY_MINUTES = 30 * 60 * 1000;
    const parsedCount = parseInt(storedCount, 10) || 1;

    if (now - lastActive > THIRTY_MINUTES) {
      visitCount = parsedCount + 1;
      try {
        localStorage.setItem(STORAGE_KEYS.VISITOR_VISIT_COUNT, visitCount.toString());
      } catch {}
    } else {
      visitCount = parsedCount;
    }
  } else {
    try {
      localStorage.setItem(STORAGE_KEYS.VISITOR_VISIT_COUNT, '1');
    } catch {}
  }

  try {
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE_TS, now.toString());
  } catch {}

  return {
    visitorId,
    visitCount,
    isReturning: visitCount > 1,
  };
}

function isAdminSession(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const match = document.cookie.match(new RegExp('(^| )' + STORAGE_KEYS.ADMIN_SESSION + '=([^;]+)'));
    return match ? match[2] === STORAGE_KEYS.ADMIN_SESSION_VALUE : false;
  } catch {
    return false;
  }
}

export function sendAnalyticsEvent(payload: {
  type: string;
  targetId?: string;
  targetTitle?: string;
  details?: string;
  duration?: number;
  scrollDepth?: number;
  section?: string;
  useBeacon?: boolean;
}) {
  if (typeof window === 'undefined' || isAdminSession()) {
    return;
  }

  const { visitorId, visitCount } = getVisitorInfo();
  const screen = `${window.screen?.width || 1920}x${window.screen?.height || 1080}`;
  const language = navigator.language || 'en';

  const body = JSON.stringify({
    type: payload.type,
    visitorId,
    visitCount,
    targetId: payload.targetId,
    targetTitle: payload.targetTitle,
    details: payload.details,
    screen,
    language,
    duration: payload.duration,
    scrollDepth: payload.scrollDepth,
    section: payload.section,
  });

  if (payload.useBeacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
    try {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics', blob);
      return;
    } catch {
      // fallback to keepalive fetch
    }
  }

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {});
}

// Click and Interaction Helpers
export const trackProjectClick = (projectId: string, projectTitle: string, action = 'view_details') => {
  sendAnalyticsEvent({
    type: ANALYTICS_EVENTS.PROJECT_CLICK,
    targetId: projectId,
    targetTitle: projectTitle,
    details: action,
  });
};

export const trackSocialClick = (platform: string, url: string) => {
  sendAnalyticsEvent({
    type: ANALYTICS_EVENTS.SOCIAL_CLICK,
    targetId: platform,
    targetTitle: platform,
    details: url,
  });
};

export const trackResumeDownload = (resumeUrl: string) => {
  sendAnalyticsEvent({
    type: ANALYTICS_EVENTS.RESUME_DOWNLOAD,
    targetId: 'resume_download',
    targetTitle: 'Resume CV',
    details: resumeUrl,
  });
};

export const trackContactClick = (channel = 'email') => {
  sendAnalyticsEvent({
    type: ANALYTICS_EVENTS.CONTACT_CLICK,
    targetId: channel,
    targetTitle: `Contact via ${channel}`,
    details: channel,
  });
};

export const trackCertificateClick = (credentialUrl: string, title: string, issuer = '') => {
  sendAnalyticsEvent({
    type: ANALYTICS_EVENTS.CERTIFICATE_CLICK,
    targetId: credentialUrl || title,
    targetTitle: `Certificate: ${title}`,
    details: issuer ? `Issuer: ${issuer} | URL: ${credentialUrl}` : credentialUrl,
    section: 'Certifications',
  });
};

export const trackCodeCopy = (projectTitle: string, language = 'code') => {
  sendAnalyticsEvent({
    type: ANALYTICS_EVENTS.CODE_COPY,
    targetId: projectTitle,
    targetTitle: `Copied Code (${language})`,
    details: `Snippet from ${projectTitle}`,
    section: 'Projects',
  });
};

export const trackOutboundClick = (url: string, label: string) => {
  sendAnalyticsEvent({
    type: ANALYTICS_EVENTS.OUTBOUND_LINK,
    targetId: url,
    targetTitle: label,
    details: url,
  });
};

export const trackChatInteraction = (messageCount: number) => {
  sendAnalyticsEvent({
    type: ANALYTICS_EVENTS.CHAT_INTERACTION,
    targetId: 'ai_chatbot',
    targetTitle: 'AI Resume Assistant',
    details: `${messageCount} messages exchanged`,
  });
};

/**
 * Initializes full session monitoring:
 * - Active engagement timer (respects tab visibility)
 * - Throttled scroll depth milestones (25%, 50%, 75%, 100%)
 * - IntersectionObserver on portfolio cards for section dwell attention
 * - Flush session summary on unload
 */
export function initSessionTelemetry(): () => void {
  if (typeof window === 'undefined' || isAdminSession()) {
    return () => {};
  }

  // 1. Log initial Page View
  sendAnalyticsEvent({
    type: ANALYTICS_EVENTS.PAGE_VIEW,
  });

  // 2. Active Engagement Timer
  let activeSeconds = 0;
  let isTabVisible = document.visibilityState === 'visible';
  let maxScrollPercentage = 0;
  const sectionDwellMap: Record<string, number> = {};
  let currentActiveSection: string | null = null;
  let sectionStartTime = Date.now();

  const intervalId = window.setInterval(() => {
    if (isTabVisible) {
      activeSeconds += 1;
      if (currentActiveSection) {
        sectionDwellMap[currentActiveSection] = (sectionDwellMap[currentActiveSection] || 0) + 1;
      }
    }
  }, 1000);

  const handleVisibilityChange = () => {
    isTabVisible = document.visibilityState === 'visible';
    if (!isTabVisible && activeSeconds >= 5) {
      flushSessionSummary();
    }
  };

  // 3. Scroll Depth Milestones
  const reportedMilestones = new Set<number>();

  const checkScrollDepth = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollHeight <= 0) return;

    const scrollPercent = Math.min(100, Math.round((scrollTop / scrollHeight) * 100));
    if (scrollPercent > maxScrollPercentage) {
      maxScrollPercentage = scrollPercent;
    }

    [25, 50, 75, 100].forEach((milestone) => {
      if (scrollPercent >= milestone && !reportedMilestones.has(milestone)) {
        reportedMilestones.add(milestone);
        sendAnalyticsEvent({
          type: ANALYTICS_EVENTS.SCROLL_DEPTH,
          scrollDepth: milestone,
          details: `Reached ${milestone}% scroll depth`,
        });
      }
    });
  };

  let scrollTicking = false;
  const handleScroll = () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        checkScrollDepth();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  };

  // 4. Section Dwell Tracking via IntersectionObserver
  let observer: IntersectionObserver | null = null;
  try {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionName =
              entry.target.getAttribute('data-section-name') ||
              entry.target.getAttribute('data-card-type') ||
              'Portfolio Card';

            if (currentActiveSection && currentActiveSection !== sectionName) {
              const spent = Math.round((Date.now() - sectionStartTime) / 1000);
              if (spent >= 4) {
                sendAnalyticsEvent({
                  type: ANALYTICS_EVENTS.SECTION_DWELL,
                  section: currentActiveSection,
                  duration: spent,
                  details: `Viewed ${currentActiveSection} for ${spent}s`,
                });
              }
            }
            currentActiveSection = sectionName;
            sectionStartTime = Date.now();
          }
        });
      },
      { threshold: 0.4 }
    );

    // Observe all bento cards with data attributes
    const targetCards = document.querySelectorAll('[data-section-name], [data-card-type]');
    targetCards.forEach((el) => observer?.observe(el));
  } catch {}

  // 5. Session Flush on Exit / Unload
  const flushSessionSummary = () => {
    if (activeSeconds < 3) return;

    // Find top engaged section
    let topSection = '';
    let maxDwell = 0;
    Object.entries(sectionDwellMap).forEach(([sec, secSeconds]) => {
      if (secSeconds > maxDwell) {
        maxDwell = secSeconds;
        topSection = sec;
      }
    });

    sendAnalyticsEvent({
      type: ANALYTICS_EVENTS.SESSION_DURATION,
      duration: activeSeconds,
      scrollDepth: maxScrollPercentage,
      section: topSection,
      details: `Active session: ${activeSeconds}s, Max scroll: ${maxScrollPercentage}%, Top section: ${topSection || 'General'}`,
      useBeacon: true,
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('beforeunload', flushSessionSummary);

  return () => {
    clearInterval(intervalId);
    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('beforeunload', flushSessionSummary);
    observer?.disconnect();
  };
}
