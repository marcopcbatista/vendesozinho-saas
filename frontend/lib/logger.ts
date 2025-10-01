// lib/logger.ts
export const logger = {
  info: (...params: any[]) => console.log('[INFO]', ...params),
  warn: (...params: any[]) => console.warn('[WARN]', ...params),
  error: (...params: any[]) => console.error('[ERROR]', ...params),
}
