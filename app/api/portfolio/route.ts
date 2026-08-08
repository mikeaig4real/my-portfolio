import { revalidatePath } from 'next/cache';
import { getPortfolioDataUnified, savePortfolioDataUnified } from '@/lib/db';
import { PortfolioDataSchema } from '@/lib/schemas/portfolioSchema';
import { validateRequest } from '@/lib/schemas/validateRequest';
import { PortfolioData } from '@/types/portfolio';
import { ApiResponse } from '@/lib/apiResponse';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const data = await getPortfolioDataUnified();
    return ApiResponse.success(data);
  } catch (error) {
    logger.error('Error fetching portfolio data', error);
    return ApiResponse.serverError('Failed to fetch portfolio data.');
  }
}

export async function POST(request: Request) {
  const validation = await validateRequest(request, PortfolioDataSchema);
  if (!validation.success) {
    logger.warn('Portfolio Save Request Validation Failed', validation.errorResponse);
    return validation.errorResponse;
  }

  try {
    const saved = await savePortfolioDataUnified(validation.data as unknown as PortfolioData);

    try {
      revalidatePath('/');
    } catch {
      // ignore revalidation error in non-static builds
    }

    logger.info('Portfolio data successfully saved & revalidated');
    return ApiResponse.success(
      saved,
      'Portfolio data saved and validated successfully!'
    );
  } catch (error) {
    logger.error('Error saving portfolio data', error);
    return ApiResponse.serverError('Server error while saving portfolio.');
  }
}

export async function PUT(request: Request) {
  return POST(request);
}
