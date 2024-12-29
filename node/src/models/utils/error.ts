import { AppError, createError } from "types";
import mongoose from "mongoose";

export const handleDBError = (error: unknown): AppError => {
  // Mongoose-specific error handling.
  if (error instanceof mongoose.Error.ValidationError) {
    return createError('VALIDATION_ERROR', 'Invalid data', {
      details: Object.values(error.errors).map(err => err.message)
    });
  }

  // Duplicate key error.
  if (error instanceof mongoose.Error && (error as any).code === 11000) {
    return createError('CONFLICT_ERROR', 'Resource already exists')
  }

  // Network Error.
  // Unknown error occured.
  return createError('INTERNAL_SERVER_ERROR', 'Unexpected Database Error occured', {
    originalError: error instanceof Error ? error.message : String(error)
  })
}
