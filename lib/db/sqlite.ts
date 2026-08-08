import { SQLiteDatabaseAdapter } from './adapters/sqliteAdapter';
import { PortfolioData } from '@/types/portfolio';

const adapter = new SQLiteDatabaseAdapter();

export async function getPortfolioFromSQLite(): Promise<PortfolioData> {
  return adapter.getPortfolio();
}

export async function savePortfolioToSQLite(data: PortfolioData): Promise<PortfolioData> {
  return adapter.savePortfolio(data);
}
