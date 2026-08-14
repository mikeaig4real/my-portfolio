import fs from 'fs';
import path from 'path';
import { IDatabaseAdapter } from '../types';
import { PortfolioData } from '@/types/portfolio';
import { defaultPortfolioData } from '@/lib/defaultData';
import { validatePortfolioData } from '@/lib/schemas/portfolioSchema';
import { DATABASE_CONSTANTS } from '@/lib/constants';
import { logger } from '@/lib/logger';

export class SQLiteDatabaseAdapter implements IDatabaseAdapter {
  readonly name = DATABASE_CONSTANTS.PROVIDERS.SQLITE;
  private storageDir = path.join(process.cwd(), DATABASE_CONSTANTS.STORAGE_DIR);
  private dbFilePath = path.join(this.storageDir, DATABASE_CONSTANTS.JSON_DB_NAME);

  async init(): Promise<void> {
    try {
      if (!fs.existsSync(this.storageDir)) {
        fs.mkdirSync(this.storageDir, { recursive: true });
      }
    } catch {
      // Fallback for read-only serverless filesystems (e.g. Vercel)
      const tmpDir = path.join('/tmp', DATABASE_CONSTANTS.STORAGE_DIR);
      try {
        if (!fs.existsSync(tmpDir)) {
          fs.mkdirSync(tmpDir, { recursive: true });
        }
        this.storageDir = tmpDir;
        this.dbFilePath = path.join(tmpDir, DATABASE_CONSTANTS.JSON_DB_NAME);
      } catch {
        // Read-only environment fallback
      }
    }
  }

  async getPortfolio(): Promise<PortfolioData> {
    await this.init();
    if (!fs.existsSync(this.dbFilePath)) {
      return defaultPortfolioData;
    }

    try {
      const raw = fs.readFileSync(this.dbFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      return validatePortfolioData(parsed) as unknown as PortfolioData;
    } catch {
      return defaultPortfolioData;
    }
  }

  async savePortfolio(data: PortfolioData): Promise<PortfolioData> {
    await this.init();
    const validated = validatePortfolioData(data);
    try {
      fs.writeFileSync(this.dbFilePath, JSON.stringify(validated, null, 2), 'utf-8');
    } catch (err) {
      logger.warn('Local file system save skipped (read-only environment):', err);
    }
    return validated as unknown as PortfolioData;
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.init();
      return true;
    } catch {
      return false;
    }
  }
}
