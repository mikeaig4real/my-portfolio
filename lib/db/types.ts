import { PortfolioData } from '@/types/portfolio';

export interface IDatabaseAdapter {
  readonly name: string;
  init(): Promise<void>;
  getPortfolio(): Promise<PortfolioData>;
  savePortfolio(data: PortfolioData): Promise<PortfolioData>;
  isHealthy(): Promise<boolean>;
}
