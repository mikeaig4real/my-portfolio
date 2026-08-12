import { IDatabaseAdapter } from '../types';
import { PortfolioData } from '@/types/portfolio';
import { defaultPortfolioData } from '@/lib/defaultData';
import { validatePortfolioData } from '@/lib/schemas/portfolioSchema';
import { DATABASE_CONSTANTS } from '@/lib/constants';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { portfolioTable } from '../schema/drizzleSchema';
import { eq } from 'drizzle-orm';
import path from 'path';
import fs from 'fs';

export class DrizzleSqliteAdapter implements IDatabaseAdapter {
  readonly name = DATABASE_CONSTANTS.PROVIDERS.DRIZZLE;
  private db: ReturnType<typeof drizzle> | null = null;

  async init(): Promise<void> {
    if (this.db) return;

    const storageDir = path.join(process.cwd(), DATABASE_CONSTANTS.STORAGE_DIR);
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const dbPath = path.join(storageDir, DATABASE_CONSTANTS.SQLITE_DB_NAME);
    const client = createClient({
      url: `file:${dbPath}`,
    });

    this.db = drizzle(client);

    // Create table if not exists — includes colorScheme column.
    // NOTE: If upgrading an existing DB that lacks the color_scheme column,
    // run: ALTER TABLE portfolio_data ADD COLUMN color_scheme TEXT NOT NULL DEFAULT 'cyber_yellow';
    await client.execute(`
      CREATE TABLE IF NOT EXISTS ${DATABASE_CONSTANTS.PORTFOLIO_TABLE_NAME} (
        id TEXT PRIMARY KEY,
        profile_json TEXT NOT NULL,
        workplaces_json TEXT NOT NULL,
        projects_json TEXT NOT NULL,
        skills_json TEXT NOT NULL,
        socials_json TEXT NOT NULL,
        cards_json TEXT NOT NULL,
        customization_json TEXT NOT NULL,
        color_scheme TEXT NOT NULL DEFAULT 'cyber_yellow',
        updated_at INTEGER NOT NULL
      );
    `);

    // Best-effort migration: add color_scheme column if missing in existing DBs
    try {
      await client.execute(
        `ALTER TABLE ${DATABASE_CONSTANTS.PORTFOLIO_TABLE_NAME} ADD COLUMN color_scheme TEXT NOT NULL DEFAULT 'cyber_yellow';`
      );
    } catch {
      // Column already exists — ignore
    }
  }

  async getPortfolio(): Promise<PortfolioData> {
    await this.init();
    const rows = await this.db!.select().from(portfolioTable).where(eq(portfolioTable.id, 'main')).limit(1);

    if (rows.length === 0) {
      await this.savePortfolio(defaultPortfolioData);
      return defaultPortfolioData;
    }

    const row = rows[0];
    const rawData = {
      profile: JSON.parse(row.profileJson),
      workplaces: JSON.parse(row.workplacesJson),
      projects: JSON.parse(row.projectsJson),
      skills: JSON.parse(row.skillsJson),
      socials: JSON.parse(row.socialsJson),
      cards: JSON.parse(row.cardsJson),
      customization: JSON.parse(row.customizationJson),
      colorScheme: row.colorScheme || 'cyber_yellow',
    };

    return validatePortfolioData(rawData) as unknown as PortfolioData;
  }

  async savePortfolio(data: PortfolioData): Promise<PortfolioData> {
    await this.init();
    const validated = validatePortfolioData(data);

    const payload = {
      id: 'main',
      profileJson: JSON.stringify(validated.profile),
      workplacesJson: JSON.stringify(validated.workplaces),
      projectsJson: JSON.stringify(validated.projects),
      skillsJson: JSON.stringify(validated.skills),
      socialsJson: JSON.stringify(validated.socials),
      cardsJson: JSON.stringify(validated.cards),
      customizationJson: JSON.stringify(validated.customization || {}),
      colorScheme: validated.colorScheme || 'cyber_yellow',
      updatedAt: Date.now(),
    };

    await this.db!.insert(portfolioTable).values(payload).onConflictDoUpdate({
      target: portfolioTable.id,
      set: payload,
    });

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
