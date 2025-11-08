/**
 * Shared API validation schemas using Zod
 * Use these schemas in API routes for consistent validation
 */

import { z } from "zod";

/**
 * Common pagination schema
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

/**
 * Common ID parameter schema
 */
export const idParamSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
});

/**
 * Common query parameters schema
 */
export const queryParamsSchema = z.object({
  search: z.string().min(1).max(100).optional(),
  sort: z.enum(["asc", "desc"]).default("desc").optional(),
  orderBy: z.string().optional(),
});

/**
 * Common tenant/user context schema
 */
export const tenantContextSchema = z.object({
  tenantId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
});

/**
 * API error response helper
 */
export function createValidationErrorResponse(errors: z.ZodError) {
  return {
    error: "Validation failed",
    details: errors.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
      code: err.code,
    })),
  };
}

/**
 * Validate request body with Zod schema
 */
export async function validateRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: ReturnType<typeof createValidationErrorResponse> }> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: createValidationErrorResponse(error),
      };
    }
    throw error;
  }
}

/**
 * Validate query parameters with Zod schema
 */
export function validateQueryParams<T>(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: ReturnType<typeof createValidationErrorResponse> } {
  try {
    const params = Object.fromEntries(
      searchParams instanceof URLSearchParams
        ? searchParams.entries()
        : Object.entries(searchParams)
    );
    const data = schema.parse(params);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: createValidationErrorResponse(error),
      };
    }
    throw error;
  }
}
