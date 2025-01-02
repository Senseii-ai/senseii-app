import { HTTP, HTTPStatus } from "@senseii/types"
import z from "zod"

export const ZAppError = z.object({
  code: z.number(),
  message: z.string(),
  details: z.record(z.unknown()).optional(),
  timestamp: z.string().datetime()
})

export type AppError = z.infer<typeof ZAppError>

export type Result<T> = { success: true, data: T } | { success: false, error: AppError }

// details field is populated only when I throw error, otherwise message will only contain database error.
export const createError = (code: HTTPStatus, message: string, details?: Record<string, unknown>): AppError => (
  {
    code, message, details, timestamp: new Date().toISOString()
  }
)
