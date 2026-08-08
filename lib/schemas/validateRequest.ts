import { NextResponse } from 'next/server';
import { ZodSchema } from 'zod';

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errorResponse: NextResponse };

/**
 * Universal, input-agnostic Zod validator helper for Next.js API routes.
 * Validates Request objects (JSON body or search params), URLSearchParams, or raw objects.
 */
export async function validateRequest<T>(
  input: Request | Record<string, unknown> | URLSearchParams,
  schema: ZodSchema<T>
): Promise<ValidationResult<T>> {
  let targetData: unknown;

  try {
    if (input instanceof Request) {
      const method = input.method.toUpperCase();
      if (method === 'GET' || method === 'HEAD') {
        const url = new URL(input.url);
        targetData = Object.fromEntries(url.searchParams.entries());
      } else {
        try {
          targetData = await input.json();
        } catch {
          const url = new URL(input.url);
          targetData = Object.fromEntries(url.searchParams.entries());
        }
      }
    } else if (input instanceof URLSearchParams) {
      targetData = Object.fromEntries(input.entries());
    } else {
      targetData = input;
    }

    const result = schema.safeParse(targetData);

    if (!result.success) {
      return {
        success: false,
        errorResponse: NextResponse.json(
          {
            success: false,
            error: 'Zod Validation Error',
            details: result.error.flatten().fieldErrors,
          },
          { status: 400 }
        ),
      };
    }

    return { success: true, data: result.data };
  } catch {
    return {
      success: false,
      errorResponse: NextResponse.json(
        { success: false, error: 'Invalid or unparseable input payload' },
        { status: 400 }
      ),
    };
  }
}
