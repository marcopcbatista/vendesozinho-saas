// lib/error-handler.ts
import { logger } from './logger'

export function handleError(error: unknown, context?: string) {
  if (error instanceof Error) {
    logger.error(context || 'Error', error.message)
  } else {
    logger.error(context || 'Unknown error', error)
  }
}
