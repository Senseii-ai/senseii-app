import { AppError, createError } from "types";
import mongoose from "mongoose";
import { infoLogger } from "@utils/logger";
import { HTTP } from "@senseii/types";

export const handleDBError = (error: unknown): AppError => {
  // Mongoose-specific error handling.
  if (error instanceof mongoose.Error.ValidationError) {
    infoLogger({ layer: "DB", status: "failed", message: "Invalid data" })
    return createError(HTTP.STATUS.BAD_REQUEST, 'Invalid data', {
      details: Object.values(error.errors).map(err => err.message)
    });
  }

  // Duplicate key error.
  if (error instanceof mongoose.Error && (error as any).code === 11000) {
    infoLogger({ layer: "DB", status: "failed", message: "Resource already exists" })
    return createError(HTTP.STATUS.CONFLICT, 'Resource already exists')
  }

  // Network Error.
  // Unknown error occured.
  const err = error instanceof Error ? error.message : String(error)
  infoLogger({ layer: "DB", status: "failed", message: err })
  return createError(HTTP.STATUS.NOT_FOUND, 'Unexpected Database Error occured', {
    originalError: err
  })
}
