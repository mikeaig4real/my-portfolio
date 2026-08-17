import config from '@/config';
import { IDatabaseAdapter } from './types';
import { MongoDatabaseAdapter } from './adapters/mongoAdapter';
import { SQLiteDatabaseAdapter } from './adapters/sqliteAdapter';
import { DrizzleSqliteAdapter } from './adapters/drizzleAdapter';
import { PortfolioData } from '@/types/portfolio';
import { logger } from '@/lib/logger';
import { triggerBackgroundSyncIfStale, syncPortfolioAcrossDatabases } from './syncEngine';

class DatabaseManager {
  private adapters: Map<string, IDatabaseAdapter> = new Map();

  constructor() {
    // Register default plug-and-play drivers
    this.registerAdapter(new MongoDatabaseAdapter());
    this.registerAdapter(new SQLiteDatabaseAdapter());
    this.registerAdapter(new DrizzleSqliteAdapter());
  }

  registerAdapter(adapter: IDatabaseAdapter): void {
    this.adapters.set(adapter.name.toLowerCase(), adapter);
  }

  getAdapter(providerName?: string): IDatabaseAdapter {
    const selected = (providerName || config.database.provider || 'sqlite').toLowerCase();
    const adapter = this.adapters.get(selected);

    if (!adapter) {
      logger.warn(`Database provider "${selected}" not found. Falling back to Drizzle SQLite adapter.`);
      return this.adapters.get('drizzle') || new DrizzleSqliteAdapter();
    }

    return adapter;
  }
}

export const dbManager = new DatabaseManager();

export async function getPortfolioDataUnified(): Promise<PortfolioData> {
  const preferred = config.database.provider || 'mongodb';
  let portfolio: PortfolioData | null = null;

  // 1. Try Preferred/MongoDB first
  if (preferred === 'mongodb') {
    try {
      const mongo = dbManager.getAdapter('mongodb');
      portfolio = await mongo.getPortfolio();
    } catch (err) {
      logger.warn('Primary MongoDB portfolio read failed, falling back to Drizzle SQLite:', err);
    }
  }

  // 2. Try Drizzle SQLite if MongoDB failed or not preferred
  if (!portfolio) {
    try {
      const drizzle = dbManager.getAdapter('drizzle');
      portfolio = await drizzle.getPortfolio();
    } catch (err) {
      logger.warn('Drizzle SQLite portfolio read failed, falling back to JSON file:', err);
    }
  }

  // 3. Fallback to JSON file
  if (!portfolio) {
    const jsonAdapter = dbManager.getAdapter('sqlite');
    portfolio = await jsonAdapter.getPortfolio();
  }

  // Trigger background synchronization across other tiers so they stay 100% in sync
  triggerBackgroundSyncIfStale(portfolio);

  return portfolio;
}

export async function savePortfolioDataUnified(data: PortfolioData): Promise<PortfolioData> {
  let savedData = data;

  // 1. Try MongoDB
  try {
    const mongo = dbManager.getAdapter('mongodb');
    savedData = await mongo.savePortfolio(data);
  } catch (err) {
    logger.warn('MongoDB portfolio save skipped (offline/unreachable):', err);
  }

  // 2. Persist to Drizzle SQLite (Primary local database)
  try {
    const drizzle = dbManager.getAdapter('drizzle');
    await drizzle.savePortfolio(savedData);
  } catch (err) {
    logger.warn('Drizzle SQLite portfolio save skipped:', err);
  }

  // 3. Mirror to JSON file fallback
  try {
    const jsonAdapter = dbManager.getAdapter('sqlite');
    await jsonAdapter.savePortfolio(savedData);
  } catch (err) {
    logger.warn('JSON file portfolio save skipped:', err);
  }

  // Asynchronously synchronize across all databases in the background
  syncPortfolioAcrossDatabases(savedData).catch((err) =>
    logger.debug('Async background post-save sync error:', err)
  );

  return savedData;
}

export * from './types';
export * from './adapters/mongoAdapter';
export * from './adapters/sqliteAdapter';
export * from './adapters/drizzleAdapter';
export * from './syncEngine';
