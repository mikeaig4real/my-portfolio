import { connectToDatabase } from '@/lib/mongodb';
import Analytics, { IAnalytics, IAnalyticsEvent, IVisitorLead, IChatMessage } from '@/models/Analytics';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { analyticsTable } from './schema/drizzleSchema';
import { eq } from 'drizzle-orm';
import { DATABASE_CONSTANTS, ANALYTICS_EVENTS } from '@/lib/constants';
import { AnalyticsData } from '@/types';
import fs from 'fs';
import path from 'path';
import { logger } from '@/lib/logger';

export type UnifiedAnalyticsData = AnalyticsData;

const defaultAnalyticsData: UnifiedAnalyticsData = {
  totalViews: 0,
  totalResumeDownloads: 0,
  totalContactClicks: 0,
  totalSocialClicks: 0,
  totalProjectClicks: 0,
  projectClicks: {},
  sectionEngagement: {},
  visitorLeads: [],
  chatTranscripts: [],
  recentEvents: [],
};

const STORAGE_DIR = path.join(process.cwd(), DATABASE_CONSTANTS.STORAGE_DIR);
const ANALYTICS_JSON_PATH = path.join(STORAGE_DIR, 'analytics.json');
const SQLITE_DB_PATH = path.join(STORAGE_DIR, DATABASE_CONSTANTS.SQLITE_DB_NAME);

function ensureStorageDir() {
  try {
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }
  } catch {
    // serverless fallback
  }
}

// ── Tier 3: JSON File Storage Helper ──────────────────────────────────────────
function readJsonAnalytics(): UnifiedAnalyticsData {
  ensureStorageDir();
  if (!fs.existsSync(ANALYTICS_JSON_PATH)) {
    return { ...defaultAnalyticsData };
  }
  try {
    const raw = fs.readFileSync(ANALYTICS_JSON_PATH, 'utf-8');
    return { ...defaultAnalyticsData, ...JSON.parse(raw) };
  } catch {
    return { ...defaultAnalyticsData };
  }
}

function writeJsonAnalytics(data: UnifiedAnalyticsData): void {
  ensureStorageDir();
  try {
    fs.writeFileSync(ANALYTICS_JSON_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    logger.warn('JSON file analytics save skipped:', err);
  }
}

// ── Tier 2: Drizzle SQLite Helper ──────────────────────────────────────────────
let drizzleClient: ReturnType<typeof createClient> | null = null;
let drizzleDb: ReturnType<typeof drizzle> | null = null;

async function getDrizzleDb() {
  if (drizzleDb) return drizzleDb;
  ensureStorageDir();
  drizzleClient = createClient({
    url: `file:${SQLITE_DB_PATH}`,
  });
  drizzleDb = drizzle(drizzleClient);

  // Initialize SQLite table if not exists
  await drizzleClient.execute(`
    CREATE TABLE IF NOT EXISTS analytics_data (
      id TEXT PRIMARY KEY,
      total_views INTEGER NOT NULL DEFAULT 0,
      total_resume_downloads INTEGER NOT NULL DEFAULT 0,
      total_contact_clicks INTEGER NOT NULL DEFAULT 0,
      total_social_clicks INTEGER NOT NULL DEFAULT 0,
      total_project_clicks INTEGER NOT NULL DEFAULT 0,
      project_clicks_json TEXT NOT NULL DEFAULT '{}',
      section_engagement_json TEXT NOT NULL DEFAULT '{}',
      recent_events_json TEXT NOT NULL DEFAULT '[]',
      visitor_leads_json TEXT NOT NULL DEFAULT '[]',
      chat_transcripts_json TEXT NOT NULL DEFAULT '[]',
      updated_at INTEGER NOT NULL
    );
  `);

  return drizzleDb;
}

async function readDrizzleAnalytics(): Promise<UnifiedAnalyticsData | null> {
  try {
    const db = await getDrizzleDb();
    const rows = await db.select().from(analyticsTable).where(eq(analyticsTable.id, 'main')).limit(1);
    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      totalViews: row.totalViews || 0,
      totalResumeDownloads: row.totalResumeDownloads || 0,
      totalContactClicks: row.totalContactClicks || 0,
      totalSocialClicks: row.totalSocialClicks || 0,
      totalProjectClicks: row.totalProjectClicks || 0,
      projectClicks: JSON.parse(row.projectClicksJson || '{}'),
      sectionEngagement: JSON.parse(row.sectionEngagementJson || '{}'),
      recentEvents: JSON.parse(row.recentEventsJson || '[]'),
      visitorLeads: JSON.parse(row.visitorLeadsJson || '[]'),
      chatTranscripts: JSON.parse(row.chatTranscriptsJson || '[]'),
    };
  } catch (err) {
    logger.warn('Drizzle SQLite read analytics failed:', err);
    return null;
  }
}

async function writeDrizzleAnalytics(data: UnifiedAnalyticsData): Promise<void> {
  try {
    const db = await getDrizzleDb();
    const payload = {
      id: 'main',
      totalViews: data.totalViews,
      totalResumeDownloads: data.totalResumeDownloads,
      totalContactClicks: data.totalContactClicks,
      totalSocialClicks: data.totalSocialClicks,
      totalProjectClicks: data.totalProjectClicks,
      projectClicksJson: JSON.stringify(data.projectClicks),
      sectionEngagementJson: JSON.stringify(data.sectionEngagement),
      recentEventsJson: JSON.stringify(data.recentEvents.slice(0, 100)),
      visitorLeadsJson: JSON.stringify(data.visitorLeads.slice(0, 50)),
      chatTranscriptsJson: JSON.stringify(data.chatTranscripts.slice(0, 200)),
      updatedAt: Date.now(),
    };

    await db.insert(analyticsTable).values(payload).onConflictDoUpdate({
      target: analyticsTable.id,
      set: payload,
    });
  } catch (err) {
    logger.warn('Drizzle SQLite write analytics failed:', err);
  }
}

// ── UNIFIED READ: MongoDB > Drizzle SQLite > JSON ──────────────────────────────
export async function getAnalyticsUnified(): Promise<UnifiedAnalyticsData> {
  // 1. Try MongoDB
  try {
    await connectToDatabase();
    const doc = (await Analytics.findOne().lean()) as unknown as IAnalytics | null;
    if (doc) {
      const projectClicksObj = doc.projectClicks instanceof Map
        ? Object.fromEntries(doc.projectClicks)
        : (doc.projectClicks || {});

      const sectionEngagementObj = doc.sectionEngagement instanceof Map
        ? Object.fromEntries(doc.sectionEngagement)
        : (doc.sectionEngagement || {});

      return {
        totalViews: doc.totalViews || 0,
        totalResumeDownloads: doc.totalResumeDownloads || 0,
        totalContactClicks: doc.totalContactClicks || 0,
        totalSocialClicks: doc.totalSocialClicks || 0,
        totalProjectClicks: doc.totalProjectClicks || 0,
        projectClicks: projectClicksObj,
        sectionEngagement: sectionEngagementObj,
        recentEvents: doc.recentEvents || [],
        visitorLeads: doc.visitorLeads || [],
        chatTranscripts: doc.chatTranscripts || [],
      };
    }
  } catch (err) {
    logger.warn('Primary MongoDB analytics fetch failed, trying Drizzle SQLite:', err);
  }

  // 2. Try Drizzle SQLite
  try {
    const sqliteData = await readDrizzleAnalytics();
    if (sqliteData) return sqliteData;
  } catch (err) {
    logger.warn('Drizzle SQLite analytics fetch failed, falling back to JSON file:', err);
  }

  // 3. Fallback to JSON file
  return readJsonAnalytics();
}

// ── UNIFIED RECORD EVENT: MongoDB + Drizzle SQLite + JSON ───────────────────────
export async function recordAnalyticsEventUnified(event: IAnalyticsEvent): Promise<{ id: string }> {
  const eventId = event.id || `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const eventWithId = { ...event, id: eventId };

  // 1. Update MongoDB
  try {
    await connectToDatabase();
    let doc = await Analytics.findOne();
    if (!doc) {
      doc = await Analytics.create({});
    }

    if (event.type === ANALYTICS_EVENTS.PAGE_VIEW) {
      doc.totalViews = (doc.totalViews || 0) + 1;
    } else if (event.type === ANALYTICS_EVENTS.RESUME_DOWNLOAD) {
      doc.totalResumeDownloads = (doc.totalResumeDownloads || 0) + 1;
    } else if (event.type === ANALYTICS_EVENTS.CONTACT_CLICK) {
      doc.totalContactClicks = (doc.totalContactClicks || 0) + 1;
    } else if (event.type === ANALYTICS_EVENTS.SOCIAL_CLICK) {
      doc.totalSocialClicks = (doc.totalSocialClicks || 0) + 1;
    } else if (event.type === ANALYTICS_EVENTS.PROJECT_CLICK) {
      doc.totalProjectClicks = (doc.totalProjectClicks || 0) + 1;
      const key = event.targetTitle || event.targetId || 'Unknown Project';
      const current = doc.projectClicks.get(key) || 0;
      doc.projectClicks.set(key, current + 1);
    } else if (event.type === ANALYTICS_EVENTS.CERTIFICATE_CLICK) {
      const sectionKey = event.section || 'Certifications';
      const current = doc.sectionEngagement.get(sectionKey) || 0;
      doc.sectionEngagement.set(sectionKey, current + 5);
    } else if (event.type === ANALYTICS_EVENTS.SECTION_DWELL && event.section) {
      const current = doc.sectionEngagement.get(event.section) || 0;
      doc.sectionEngagement.set(event.section, current + (event.duration || 5));
    }

    doc.recentEvents.unshift(eventWithId);
    if (doc.recentEvents.length > 100) {
      doc.recentEvents = doc.recentEvents.slice(0, 100);
    }

    await doc.save();
  } catch (mongoErr) {
    logger.warn('MongoDB event write skipped (offline/fallback):', mongoErr);
  }

  // 2. Read local state, update and save to Drizzle SQLite and JSON
  try {
    const currentData = (await readDrizzleAnalytics()) || readJsonAnalytics();

    if (event.type === ANALYTICS_EVENTS.PAGE_VIEW) {
      currentData.totalViews += 1;
    } else if (event.type === ANALYTICS_EVENTS.RESUME_DOWNLOAD) {
      currentData.totalResumeDownloads += 1;
    } else if (event.type === ANALYTICS_EVENTS.CONTACT_CLICK) {
      currentData.totalContactClicks += 1;
    } else if (event.type === ANALYTICS_EVENTS.SOCIAL_CLICK) {
      currentData.totalSocialClicks += 1;
    } else if (event.type === ANALYTICS_EVENTS.PROJECT_CLICK) {
      currentData.totalProjectClicks += 1;
      const key = event.targetTitle || event.targetId || 'Unknown Project';
      currentData.projectClicks[key] = (currentData.projectClicks[key] || 0) + 1;
    } else if (event.type === ANALYTICS_EVENTS.CERTIFICATE_CLICK) {
      const sectionKey = event.section || 'Certifications';
      currentData.sectionEngagement[sectionKey] =
        (currentData.sectionEngagement[sectionKey] || 0) + 5;
    } else if (event.type === ANALYTICS_EVENTS.SECTION_DWELL && event.section) {
      currentData.sectionEngagement[event.section] =
        (currentData.sectionEngagement[event.section] || 0) + (event.duration || 5);
    }

    currentData.recentEvents.unshift(eventWithId);
    if (currentData.recentEvents.length > 100) {
      currentData.recentEvents = currentData.recentEvents.slice(0, 100);
    }

    // Write to Drizzle SQLite
    await writeDrizzleAnalytics(currentData);
    // Write to JSON file
    writeJsonAnalytics(currentData);
  } catch (localErr) {
    logger.warn('Local tier analytics write error:', localErr);
  }

  return { id: eventId };
}

// ── UNIFIED CHAT & LEAD RECORDING: MongoDB + Drizzle SQLite + JSON ──────────────
export async function recordChatMessageAndLeadUnified(
  visitorId: string,
  userMessage: string,
  assistantReply: string,
  leadInfo?: { name?: string; email?: string; company?: string; intent?: string }
): Promise<void> {
  const userChatId = `chat_${Date.now()}_u`;
  const botChatId = `chat_${Date.now()}_b`;
  const timestamp = new Date();

  // 1. Try MongoDB
  try {
    await connectToDatabase();
    let doc = await Analytics.findOne();
    if (!doc) {
      doc = await Analytics.create({});
    }

    doc.chatTranscripts.push(
      { id: userChatId, visitorId, role: 'user', content: userMessage, timestamp },
      { id: botChatId, visitorId, role: 'assistant', content: assistantReply, timestamp }
    );

    if (leadInfo?.name || leadInfo?.email || leadInfo?.company || leadInfo?.intent) {
      const idx = doc.visitorLeads.findIndex((l: IVisitorLead) => l.visitorId === visitorId);
      if (idx >= 0) {
        doc.visitorLeads[idx].name = leadInfo.name || doc.visitorLeads[idx].name;
        doc.visitorLeads[idx].email = leadInfo.email || doc.visitorLeads[idx].email;
        doc.visitorLeads[idx].company = leadInfo.company || doc.visitorLeads[idx].company;
        doc.visitorLeads[idx].intent = leadInfo.intent || doc.visitorLeads[idx].intent;
        doc.visitorLeads[idx].lastActive = timestamp;
      } else {
        doc.visitorLeads.push({
          visitorId,
          name: leadInfo.name,
          email: leadInfo.email,
          company: leadInfo.company,
          intent: leadInfo.intent,
          lastActive: timestamp,
        });
      }
    }

    if (doc.chatTranscripts.length > 300) {
      doc.chatTranscripts = doc.chatTranscripts.slice(-300);
    }

    await doc.save();
  } catch (err) {
    logger.warn('MongoDB chat save skipped:', err);
  }

  // 2. Update Drizzle SQLite + JSON file
  try {
    const currentData = (await readDrizzleAnalytics()) || readJsonAnalytics();

    currentData.chatTranscripts.push(
      { id: userChatId, visitorId, role: 'user', content: userMessage, timestamp },
      { id: botChatId, visitorId, role: 'assistant', content: assistantReply, timestamp }
    );

    if (leadInfo?.name || leadInfo?.email || leadInfo?.company || leadInfo?.intent) {
      const idx = currentData.visitorLeads.findIndex((l) => l.visitorId === visitorId);
      if (idx >= 0) {
        currentData.visitorLeads[idx].name = leadInfo.name || currentData.visitorLeads[idx].name;
        currentData.visitorLeads[idx].email = leadInfo.email || currentData.visitorLeads[idx].email;
        currentData.visitorLeads[idx].company = leadInfo.company || currentData.visitorLeads[idx].company;
        currentData.visitorLeads[idx].intent = leadInfo.intent || currentData.visitorLeads[idx].intent;
        currentData.visitorLeads[idx].lastActive = timestamp;
      } else {
        currentData.visitorLeads.push({
          visitorId,
          name: leadInfo.name,
          email: leadInfo.email,
          company: leadInfo.company,
          intent: leadInfo.intent,
          lastActive: timestamp,
        });
      }
    }

    await writeDrizzleAnalytics(currentData);
    writeJsonAnalytics(currentData);
  } catch (localErr) {
    logger.warn('Local tier chat save error:', localErr);
  }
}

// ── UNIFIED DELETION: MongoDB + Drizzle SQLite + JSON ───────────────────────────
export async function deleteAnalyticsUnified(
  action: 'delete_event' | 'delete_chat' | 'delete_lead' | 'clear_events' | 'reset_all',
  id?: string,
  visitorId?: string
): Promise<void> {
  // 1. Delete in MongoDB
  try {
    await connectToDatabase();
    const doc = await Analytics.findOne();
    if (doc) {
      if (action === 'delete_event' && id) {
        doc.recentEvents = doc.recentEvents.filter(
          (e: IAnalyticsEvent & { _id?: { toString: () => string } }) => e.id !== id && e._id?.toString() !== id
        );
      } else if (action === 'delete_chat') {
        if (id) {
          doc.chatTranscripts = doc.chatTranscripts.filter(
            (c: IChatMessage & { _id?: { toString: () => string } }) => c.id !== id && c._id?.toString() !== id
          );
        } else if (visitorId) {
          doc.chatTranscripts = doc.chatTranscripts.filter((c: IChatMessage) => c.visitorId !== visitorId);
        }
      } else if (action === 'delete_lead' && visitorId) {
        doc.visitorLeads = doc.visitorLeads.filter((l: IVisitorLead) => l.visitorId !== visitorId);
        doc.chatTranscripts = doc.chatTranscripts.filter((c: IChatMessage) => c.visitorId !== visitorId);
      } else if (action === 'clear_events') {
        doc.recentEvents = [];
      } else if (action === 'reset_all') {
        doc.totalViews = 0;
        doc.totalResumeDownloads = 0;
        doc.totalContactClicks = 0;
        doc.totalSocialClicks = 0;
        doc.totalProjectClicks = 0;
        doc.projectClicks = new Map();
        doc.sectionEngagement = new Map();
        doc.visitorLeads = [];
        doc.chatTranscripts = [];
        doc.recentEvents = [];
      }

      await doc.save();
    }
  } catch (mongoErr) {
    logger.warn('MongoDB deletion skipped:', mongoErr);
  }

  // 2. Delete in Drizzle SQLite + JSON file
  try {
    const currentData = (await readDrizzleAnalytics()) || readJsonAnalytics();

    if (action === 'delete_event' && id) {
      currentData.recentEvents = currentData.recentEvents.filter((e) => e.id !== id);
    } else if (action === 'delete_chat') {
      if (id) {
        currentData.chatTranscripts = currentData.chatTranscripts.filter((c) => c.id !== id);
      } else if (visitorId) {
        currentData.chatTranscripts = currentData.chatTranscripts.filter((c) => c.visitorId !== visitorId);
      }
    } else if (action === 'delete_lead' && visitorId) {
      currentData.visitorLeads = currentData.visitorLeads.filter((l) => l.visitorId !== visitorId);
      currentData.chatTranscripts = currentData.chatTranscripts.filter((c) => c.visitorId !== visitorId);
    } else if (action === 'clear_events') {
      currentData.recentEvents = [];
    } else if (action === 'reset_all') {
      currentData.totalViews = 0;
      currentData.totalResumeDownloads = 0;
      currentData.totalContactClicks = 0;
      currentData.totalSocialClicks = 0;
      currentData.totalProjectClicks = 0;
      currentData.projectClicks = {};
      currentData.sectionEngagement = {};
      currentData.visitorLeads = [];
      currentData.chatTranscripts = [];
      currentData.recentEvents = [];
    }

    await writeDrizzleAnalytics(currentData);
    writeJsonAnalytics(currentData);
  } catch (localErr) {
    logger.warn('Local tier deletion error:', localErr);
  }
}
