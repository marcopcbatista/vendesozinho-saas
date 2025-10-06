import { NextRequest } from 'next/server'

interface RateLimitOptions {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Maximum number of unique tokens to track
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number // Timestamp when the window resets
}

// In-memory storage for rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 5 * 60 * 1000)

export function rateLimit(options: RateLimitOptions) {
  return {
    check: async (limit: number, token: string): Promise<RateLimitResult> => {
      const now = Date.now()
      const key = `${token}_${Math.floor(now / options.interval)}`
      
      const record = rateLimitMap.get(key) || { count: 0, resetTime: now + options.interval }
      
      // If window has expired, reset
      if (now > record.resetTime) {
        record.count = 0
        record.resetTime = now + options.interval
      }

      const success = record.count < limit
      
      if (success) {
        record.count++
        rateLimitMap.set(key, record)
      }

      // Cleanup old entries if map gets too large
      if (rateLimitMap.size > options.uniqueTokenPerInterval * 2) {
        const expiredKeys = Array.from(rateLimitMap.entries())
          .filter(([, value]) => now > value.resetTime)
          .map(([key]) => key)
        
        expiredKeys.forEach(key => rateLimitMap.delete(key))
      }

      return {
        success,
        limit,
        remaining: Math.max(0, limit - record.count),
        reset: record.resetTime
      }
    }
  }
}

// Helper function to get client IP from request
export function getClientIP(request: NextRequest): string {
  // Try to get IP from various headers (for different proxy setups)
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  return request.ip || 'unknown'
}

// Advanced rate limiter with multiple strategies
export class AdvancedRateLimit {
  private strategies: Map<string, RateLimitOptions> = new Map()
  private storage = new Map<string, { count: number; resetTime: number }>()

  constructor() {
    // Default strategies
    this.strategies.set('login', { interval: 15 * 60 * 1000, uniqueTokenPerInterval: 500 })
    this.strategies.set('register', { interval: 60 * 60 * 1000, uniqueTokenPerInterval: 200 })
    this.strategies.set('reset', { interval: 60 * 60 * 1000, uniqueTokenPerInterval: 100 })
    this.strategies.set('api', { interval: 60 * 1000, uniqueTokenPerInterval: 1000 })
  }

  async check(
    strategy: string, 
    limit: number, 
    token: string,
    customOptions?: Partial<RateLimitOptions>
  ): Promise<RateLimitResult> {
    const options = customOptions 
      ? { ...this.strategies.get('api')!, ...customOptions }
      : this.strategies.get(strategy) || this.strategies.get('api')!

    const now = Date.now()
    const key = `${strategy}_${token}_${Math.floor(now / options.interval)}`
    
    const record = this.storage.get(key) || { count: 0, resetTime: now + options.interval }
    
    if (now > record.resetTime) {
      record.count = 0
      record.resetTime = now + options.interval
    }

    const success = record.count < limit
    
    if (success) {
      record.count++
      this.storage.set(key, record)
    }

    // Cleanup
    this.cleanup()

    return {
      success,
      limit,
      remaining: Math.max(0, limit - record.count),
      reset: record.resetTime
    }
  }

  private cleanup() {
    if (this.storage.size < 10000) return // Only cleanup when getting large
    
    const now = Date.now()
    const expiredKeys: string[] = []
    
    for (const [key, value] of this.storage.entries()) {
      if (now > value.resetTime) {
        expiredKeys.push(key)
      }
    }
    
    expiredKeys.forEach(key => this.storage.delete(key))
  }

  // Add custom strategy
  addStrategy(name: string, options: RateLimitOptions) {
    this.strategies.set(name, options)
  }

  // Get current status for a token
  getStatus(strategy: string, token: string): RateLimitResult | null {
    const options = this.strategies.get(strategy)
    if (!options) return null

    const now = Date.now()
    const key = `${strategy}_${token}_${Math.floor(now / options.interval)}`
    const record = this.storage.get(key)
    
    if (!record) {
      return {
        success: true,
        limit: 0, // Unknown limit without checking
        remaining: 0,
        reset: now + options.interval
      }
    }

    return {
      success: true, // We're just checking status, not incrementing
      limit: 0,
      remaining: Math.max(0, record.count),
      reset: record.resetTime
    }
  }
}

// Global instance
export const advancedRateLimit = new AdvancedRateLimit()

// Middleware helper
export function createRateLimitMiddleware(strategy: string, limit: number) {
  return async (request: NextRequest) => {
    const ip = getClientIP(request)
    const result = await advancedRateLimit.check(strategy, limit, ip)
    
    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.toString(),
            'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString()
          }
        }
      )
    }

    return null // Continue to next middleware/handler
  }
}

// Export commonly used rate limiters
export const loginRateLimit = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500
})

export const registerRateLimit = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 200
})

export const apiRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 1000
})

