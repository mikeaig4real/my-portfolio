import { runStructuredInference } from '@/lib/ai/inference';
import { generateRISENPrompt } from '@/lib/ai/prompts';
import { PortfolioDataSchema, AIGenerateInputSchema } from '@/lib/schemas/portfolioSchema';
import { validateRequest } from '@/lib/schemas/validateRequest';
import { savePortfolioDataUnified } from '@/lib/db';
import { PortfolioData } from '@/types/portfolio';
import { AI_CONSTANTS } from '@/lib/constants';
import { ApiResponse } from '@/lib/apiResponse';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  const inputValidation = await validateRequest(request, AIGenerateInputSchema);
  if (!inputValidation.success) {
    logger.warn('AI Generation Request Validation Failed', inputValidation.errorResponse);
    return inputValidation.errorResponse;
  }

  const { resumeText, provider, apiKey, model } = inputValidation.data;

  try {
    logger.info('Initiating AI Portfolio Generation from Resume', {
      provider: provider || AI_CONSTANTS.DEFAULT_PROVIDER,
      model: model || AI_CONSTANTS.DEFAULT_MODEL,
      resumeLength: resumeText.length,
    });

    const userPrompt = generateRISENPrompt(resumeText);
    const messages = [
      {
        role: AI_CONSTANTS.ROLES.SYSTEM as 'system',
        content: AI_CONSTANTS.SYSTEM_PROMPT,
      },
      {
        role: AI_CONSTANTS.ROLES.USER as 'user',
        content: userPrompt,
      },
    ];

    // Execute resilient structured inference with automatic self-repair reflection loop
    const validatedPortfolio: PortfolioData = await runStructuredInference<PortfolioData>({
      schema: PortfolioDataSchema as unknown as import('zod').ZodType<PortfolioData>,
      schemaName: AI_CONSTANTS.SCHEMA_NAME,
      messages,
      provider: provider || AI_CONSTANTS.DEFAULT_PROVIDER,
      apiKey,
      model: model || AI_CONSTANTS.DEFAULT_MODEL,
      temperature: 0.2,
      maxRepairAttempts: 2,
    });

    // Save directly to active database (Drizzle SQLite / MongoDB / JSON)
    await savePortfolioDataUnified(validatedPortfolio);
    logger.info('Unified Portfolio Data saved to database after AI generation.');

    return ApiResponse.success(
      validatedPortfolio,
      'Portfolio successfully generated and initialized from CV!'
    );
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('AI Generation API Endpoint Failure', { message: err.message, stack: err.stack });
    return ApiResponse.serverError(err.message || 'Failed to generate portfolio with AI.');
  }
}
