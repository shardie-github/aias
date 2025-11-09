/**
 * Runtime Validation and Type Safety Utilities
 * Provides runtime validation to complement TypeScript's compile-time checks
 */

import { z } from "zod";

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  path: string[];
  message: string;
  code: string;
}

/**
 * Validate data against Zod schema with detailed error reporting
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    }

    const errors: ValidationError[] = result.error.errors.map((err) => ({
      path: err.path.map(String),
      message: err.message,
      code: err.code,
    }));

    return {
      success: false,
      errors,
    };
  } catch (error) {
    return {
      success: false,
      errors: [
        {
          path: [],
          message: error instanceof Error ? error.message : "Unknown validation error",
          code: "UNKNOWN_ERROR",
        },
      ],
    };
  }
}

/**
 * Assert data matches schema, throw if invalid
 */
export function assert<T>(schema: z.ZodSchema<T>, data: unknown): asserts data is T {
  const result = validate(schema, data);
  if (!result.success) {
    const errorMessages = result.errors?.map(e => `${e.path.join(".")}: ${e.message}`).join(", ");
    throw new Error(`Validation failed: ${errorMessages}`);
  }
}

/**
 * Validate API request body
 */
export function validateRequestBody<T>(schema: z.ZodSchema<T>, body: unknown): T {
  assert(schema, body);
  return body;
}

/**
 * Validate query parameters
 */
export function validateQueryParams<T>(schema: z.ZodSchema<T>, params: unknown): T {
  assert(schema, params);
  return params;
}

/**
 * Validate environment variables
 */
export function validateEnv<T>(schema: z.ZodSchema<T>, env: Record<string, string | undefined>): T {
  const result = validate(schema, env);
  if (!result.success) {
    const errorMessages = result.errors?.map(e => `${e.path.join(".")}: ${e.message}`).join("\n");
    throw new Error(`Environment validation failed:\n${errorMessages}`);
  }
  return result.data!;
}

/**
 * Create a validator function for API routes
 */
export function createValidator<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): T => {
    return validateRequestBody(schema, data);
  };
}

/**
 * Common validation schemas
 */
export const commonSchemas = {
  id: z.string().min(1),
  email: z.string().email(),
  url: z.string().url(),
  uuid: z.string().uuid(),
  nonEmptyString: z.string().min(1),
  positiveNumber: z.number().positive(),
  nonNegativeNumber: z.number().nonnegative(),
  dateString: z.string().datetime(),
  pagination: z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20),
  }),
};
