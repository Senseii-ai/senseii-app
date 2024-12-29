import { HTTP, HTTPStatus } from "@senseii/types"
import z from "zod"

const ZErrorCode = z.enum([
  'VALIDATION_ERROR',
  'CONFLICT_ERROR',
  'NOT_FOUND_ERROR',
  'INTERNAL_SERVER_ERROR'
])
const ZAppError = z.object({
  code: z.number(),
  message: z.string(),
  details: z.record(z.unknown()).optional(),
  timestamp: z.date()
})

export type AppError = z.infer<typeof ZAppError>
type ErrorCode = z.infer<typeof ZErrorCode>

export type Result<T> = { success: true, data: T } | { success: false, error: AppError }

export const createError = (code: HTTPStatus, message: string, details?: Record<string, unknown>): AppError => (
  {
    code, message, details, timestamp: new Date()
  }
)
