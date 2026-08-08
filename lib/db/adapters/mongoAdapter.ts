import { IDatabaseAdapter } from '../types';
import { PortfolioData } from '@/types/portfolio';
import { connectToDatabase } from '@/lib/mongodb';
import Portfolio from '@/models/Portfolio';
import { defaultPortfolioData } from '@/lib/defaultData';
import { validatePortfolioData } from '@/lib/schemas/portfolioSchema';
import { DATABASE_CONSTANTS } from '@/lib/constants';

export class MongoDatabaseAdapter implements IDatabaseAdapter {
  readonly name = DATABASE_CONSTANTS.PROVIDERS.MONGODB;

  async init(): Promise<void> {
    await connectToDatabase();
  }

  async getPortfolio(): Promise<PortfolioData> {
    await this.init();
    const doc = (await Portfolio.findOne().lean()) as unknown as PortfolioData | null;
    if (!doc) {
      const created = await Portfolio.create(defaultPortfolioData);
      return validatePortfolioData(created.toObject()) as unknown as PortfolioData;
    }
    return validatePortfolioData(doc) as unknown as PortfolioData;
  }

  async savePortfolio(data: PortfolioData): Promise<PortfolioData> {
    await this.init();
    const validated = validatePortfolioData(data);
    const updated = (await Portfolio.findOneAndUpdate(
      {},
      validated,
      { upsert: true, new: true, runValidators: true }
    ).lean()) as unknown as PortfolioData;
    return validatePortfolioData(updated) as unknown as PortfolioData;
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
