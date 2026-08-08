import { zodResponseFormat } from 'openai/helpers/zod';
import { runInference } from '@/lib/ai/inference';
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
        role: AI_CONSTANTS.ROLES.SYSTEM,
        content: AI_CONSTANTS.SYSTEM_PROMPT,
      },
      {
        role: AI_CONSTANTS.ROLES.USER,
        content: userPrompt,
      },
    ];

    let validatedPortfolio: PortfolioData | null = null;

    // Primary Execution: Enforce Native Zod Structured Output + Validation
    try {
      const rawJsonResponse = (await runInference(messages, {
        provider: provider || AI_CONSTANTS.DEFAULT_PROVIDER,
        apiKey,
        model: model || AI_CONSTANTS.DEFAULT_MODEL,
        response_format: zodResponseFormat(PortfolioDataSchema, AI_CONSTANTS.SCHEMA_NAME),
      })) as string;

      logger.debug('Raw AI Primary Output Yielded', { rawJsonResponse });

      const parsedPrimary = JSON.parse(rawJsonResponse);
      const primaryValidation = PortfolioDataSchema.safeParse(parsedPrimary);
      if (primaryValidation.success) {
        validatedPortfolio = primaryValidation.data as unknown as PortfolioData;
        logger.info('Successfully generated and validated portfolio via primary Zod response_format.');
      } else {
        logger.warn('Primary Zod Validation Failed on Output Payload', {
          errors: primaryValidation.error.flatten().fieldErrors,
          payload: parsedPrimary,
        });
        throw new Error(`Zod Schema Validation Error: ${JSON.stringify(primaryValidation.error.flatten().fieldErrors)}`);
      }
    } catch (primaryError) {
      logger.warn('Native response_format parsing failed, executing multishot text fallback', {
        error: (primaryError as Error).message,
      });

      // Fallback Execution: Multishot Cleaned Prompting + Zod Validation
      const rawTextResponse = (await runInference(messages, {
        provider: provider || AI_CONSTANTS.DEFAULT_PROVIDER,
        apiKey,
        model: model || AI_CONSTANTS.DEFAULT_MODEL,
        response_format: { type: 'text' },
      })) as string;

      const cleanedJson = rawTextResponse
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      logger.debug('Raw AI Fallback Text Output Yielded', { cleanedJson });

      const parsedFallback = JSON.parse(cleanedJson);
      const fallbackValidation = PortfolioDataSchema.safeParse(parsedFallback);
      if (fallbackValidation.success) {
        validatedPortfolio = fallbackValidation.data as unknown as PortfolioData;
        logger.info('Successfully validated portfolio via text fallback.');
      } else {
        logger.error('Fallback Zod Schema Validation Failed', {
          errors: fallbackValidation.error.flatten().fieldErrors,
          payload: parsedFallback,
        });
        throw new Error(`Fallback Zod Schema Error: ${JSON.stringify(fallbackValidation.error.flatten().fieldErrors)}`);
      }
    }

    if (!validatedPortfolio) {
      throw new Error('Failed to parse or validate generated portfolio object.');
    }

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
