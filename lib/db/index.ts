import config from '@/config';
import { IDatabaseAdapter } from './types';
import { MongoDatabaseAdapter } from './adapters/mongoAdapter';
import { SQLiteDatabaseAdapter } from './adapters/sqliteAdapter';
import { DrizzleSqliteAdapter } from './adapters/drizzleAdapter';
import { PortfolioData } from '@/types/portfolio';

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
      console.warn(`Database provider "${selected}" not found. Falling back to Drizzle SQLite adapter.`);
      return this.adapters.get('drizzle') || new DrizzleSqliteAdapter();
    }

    return adapter;
  }
}

export const dbManager = new DatabaseManager();

export async function getPortfolioDataUnified(): Promise<PortfolioData> {
  const adapter = dbManager.getAdapter();
  try {
    return await adapter.getPortfolio();
  } catch (err) {
    console.warn(`Primary database adapter "${adapter.name}" failed, falling back to SQLite:`, err);
    const fallback = dbManager.getAdapter('sqlite');
    return await fallback.getPortfolio();
  }
}

export async function savePortfolioDataUnified(data: PortfolioData): Promise<PortfolioData> {
  const adapter = dbManager.getAdapter();
  try {
    const saved = await adapter.savePortfolio(data);
    if (adapter.name !== 'sqlite') {
      await dbManager.getAdapter('sqlite').savePortfolio(data);
    }
    return saved;
  } catch (err) {
    console.warn(`Primary database adapter "${adapter.name}" save failed, saving to SQLite fallback:`, err);
    return await dbManager.getAdapter('sqlite').savePortfolio(data);
  }
}

export * from './types';
export * from './adapters/mongoAdapter';
export * from './adapters/sqliteAdapter';
export * from './adapters/drizzleAdapter';
