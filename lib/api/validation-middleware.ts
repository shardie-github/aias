import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateRequestBody } from "../validation/runtime-validation";

export function createValidatedRoute<T>(
  schema: z.ZodSchema<T>,
  handler: (data: T, request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    try {
      const body = await request.json();
      const validatedData = validateRequestBody(schema, body);
      return handler(validatedData, request);
    } catch (error) {
      return NextResponse.json(
        {
          error: "Validation failed",
          message: error instanceof Error ? error.message : "Invalid request",
        },
        { status: 400 }
      );
    }
  };
}
