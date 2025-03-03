import { NextResponse } from "next/server";
import { ZodError } from "zod";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
}

export function successResponse<T>(data: T): Response {
  return new Response(
    JSON.stringify({
      success: true,
      data,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export function errorResponse(
  message: string,
  details?: any,
  status: number = 400
): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: {
        message,
        details,
      },
    }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export function handleZodError(error: ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  error.errors.forEach((err) => {
    const path = err.path.join(".");
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(err.message);
  });

  return errors;
}
