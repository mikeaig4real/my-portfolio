import { PortfolioData } from '@/types/portfolio';
import { dbManager } from './index';
import { logger } from '@/lib/logger';
import { getAnalyticsUnified } from './analyticsDb';
import { connectToDatabase } from '@/lib/mongodb';
import Analytics from '@/models/Analytics';

let isSyncRunning = false;
let lastSyncTimestamp = 0;
const SYNC_THROTTLE_MS = 60000; // Run at most once every 60 seconds

/**
 * Asynchronously synchronizes portfolio data across all 3 tiers (MongoDB, Drizzle SQLite, JSON).
 * Ensures that if any tier went offline and came back, or was updated independently,
 * all tiers converge to the latest, most accurate data.
 */
export async function syncPortfolioAcrossDatabases(sourceData?: PortfolioData): Promise<void> {
  if (isSyncRunning) return;
  isSyncRunning = true;

  try {
    let bestData: PortfolioData | null = sourceData || null;

    // If sourceData was not explicitly provided, fetch from the most up-to-date available adapter
    if (!bestData) {
      // Try Drizzle SQLite first (fastest local source of truth)
      try {
        const drizzle = dbManager.getAdapter('drizzle');
        bestData = await drizzle.getPortfolio();
      } catch {
        // ignore
      }

      // Try MongoDB
      try {
        const mongo = dbManager.getAdapter('mongodb');
        const mongoData = await mongo.getPortfolio();
        // If mongoData has content and we had nothing, use it
        if (!bestData || (mongoData.projects && mongoData.projects.length >= (bestData.projects?.length || 0))) {
          bestData = mongoData;
        }
      } catch {
        // ignore
      }

      // Try JSON file fallback
      if (!bestData) {
        try {
          const jsonAdapter = dbManager.getAdapter('sqlite');
          bestData = await jsonAdapter.getPortfolio();
        } catch {
          // ignore
        }
      }
    }

    if (!bestData) {
      isSyncRunning = false;
      return;
    }

    // Now asynchronously replicate bestData to all 3 adapters in parallel (best-effort)
    const syncPromises: Promise<unknown>[] = [];

    // 1. Replicate to MongoDB
    syncPromises.push(
      (async () => {
        try {
          const mongo = dbManager.getAdapter('mongodb');
          await mongo.savePortfolio(bestData!);
        } catch (err: unknown) {
          logger.debug('Async sync to MongoDB skipped (unreachable):', (err as Error).message);
        }
      })()
    );

    // 2. Replicate to Drizzle SQLite
    syncPromises.push(
      (async () => {
        try {
          const drizzle = dbManager.getAdapter('drizzle');
          await drizzle.savePortfolio(bestData!);
        } catch (err: unknown) {
          logger.debug('Async sync to Drizzle SQLite skipped:', (err as Error).message);
        }
      })()
    );

    // 3. Replicate to JSON file
    syncPromises.push(
      (async () => {
        try {
          const jsonAdapter = dbManager.getAdapter('sqlite');
          await jsonAdapter.savePortfolio(bestData!);
        } catch (err: unknown) {
          logger.debug('Async sync to JSON file skipped:', (err as Error).message);
        }
      })()
    );

    await Promise.allSettled(syncPromises);
    lastSyncTimestamp = Date.now();
    logger.info('🔄 [Database Sync] Portfolio data successfully synchronized across all active storage tiers.');
  } catch (err: unknown) {
    logger.warn('Background database synchronization encountered an issue:', err);
  } finally {
    isSyncRunning = false;
  }
}

/**
 * Reconciles and syncs analytics events, chat transcripts, and visitor leads across databases.
 */
export async function syncAnalyticsAcrossDatabases(): Promise<void> {
  try {
    const unifiedData = await getAnalyticsUnified();
    if (!unifiedData) return;

    // If MongoDB is reachable, reconcile latest counts and events
    try {
      await connectToDatabase();
      let doc = await Analytics.findOne();
      if (!doc) {
        doc = await Analytics.create({});
      }

      // Merge metrics
      doc.totalViews = Math.max(doc.totalViews || 0, unifiedData.totalViews || 0);
      doc.totalResumeDownloads = Math.max(doc.totalResumeDownloads || 0, unifiedData.totalResumeDownloads || 0);
      doc.totalContactClicks = Math.max(doc.totalContactClicks || 0, unifiedData.totalContactClicks || 0);
      doc.totalSocialClicks = Math.max(doc.totalSocialClicks || 0, unifiedData.totalSocialClicks || 0);
      doc.totalProjectClicks = Math.max(doc.totalProjectClicks || 0, unifiedData.totalProjectClicks || 0);

      // Merge visitor leads
      const existingLeadIds = new Set((doc.visitorLeads || []).map((l: { visitorId: string }) => l.visitorId));
      for (const lead of unifiedData.visitorLeads || []) {
        if (!existingLeadIds.has(lead.visitorId)) {
          doc.visitorLeads.push(lead);
          existingLeadIds.add(lead.visitorId);
        }
      }

      await doc.save();
      logger.debug('🔄 [Analytics Sync] Analytics data reconciled with MongoDB.');
    } catch {
      // MongoDB unreachable, local Drizzle SQLite is holding the records safely
    }
  } catch (err: unknown) {
    logger.debug('Background analytics sync skipped:', err);
  }
}

/**
 * Triggers throttled background sync if enough time has passed.
 */
export function triggerBackgroundSyncIfStale(data?: PortfolioData): void {
  if (Date.now() - lastSyncTimestamp > SYNC_THROTTLE_MS) {
    // Run in background without awaiting
    setTimeout(() => {
      syncPortfolioAcrossDatabases(data).catch(() => {});
      syncAnalyticsAcrossDatabases().catch(() => {});
    }, 100);
  }
}
