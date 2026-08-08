import { NextResponse } from 'next/server';

export const ApiResponse = {
  /**
   * Standardized success JSON response builder.
   */
  success<T>(data?: T, message?: string, status: number = 200): NextResponse {
    return NextResponse.json(
      {
        success: true,
        ...(data !== undefined ? { data } : {}),
        ...(message ? { message } : {}),
      },
      { status }
    );
  },

  /**
   * Standardized error JSON response builder.
   */
  error(error: string, status: number = 400, details?: unknown): NextResponse {
    return NextResponse.json(
      {
        success: false,
        error,
        ...(details !== undefined ? { details } : {}),
      },
      { status }
    );
  },

  /**
   * Quick 401 Unauthorized response helper.
   */
  unauthorized(message: string = 'Unauthorized access.'): NextResponse {
    return ApiResponse.error(message, 401);
  },

  /**
   * Quick 403 Forbidden response helper.
   */
  forbidden(message: string = 'Forbidden action.'): NextResponse {
    return ApiResponse.error(message, 403);
  },

  /**
   * Quick 404 Not Found response helper.
   */
  notFound(message: string = 'Resource not found.'): NextResponse {
    return ApiResponse.error(message, 404);
  },

  /**
   * Quick 500 Internal Server Error response helper.
   */
  serverError(message: string = 'Internal server error.'): NextResponse {
    return ApiResponse.error(message, 500);
  },
};
