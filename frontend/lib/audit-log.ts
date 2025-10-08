interface AuditLogEntry {
  event: string
  userId?: string
  email?: string
  ip?: string
  userAgent?: string
  success: boolean
  details?: any
  timestamp?: string
}

interface AuditLogConfig {
  enableConsole: boolean
  enableDatabase: boolean
  enableFile: boolean
  logLevel: 'debug' | 'info' | 'warn' | 'error'
  sensitiveFields: string[]
}

const defaultConfig: AuditLogConfig = {
  enableConsole: process.env.NODE_ENV === 'development',
  enableDatabase: true,
  enableFile: process.env.NODE_ENV === 'production',
  logLevel: 'info',
  sensitiveFields: ['password', 'token', 'hashedPassword', 'refreshToken']
}

// In-memory buffer for batch processing (production optimization)
const logBuffer: AuditLogEntry[] = []
const BUFFER_SIZE = 100
const FLUSH_INTERVAL = 30000 // 30 seconds

// Flush buffer periodically
let flushTimer: NodeJS.Timeout
if (typeof window === 'undefined') { // Server-side only
  flushTimer = setInterval(() => {
    flushLogBuffer()
  }, FLUSH_INTERVAL)
}

export async function auditLog(entry: AuditLogEntry, config: Partial<AuditLogConfig> = {}) {
  const finalConfig = { ...defaultConfig, ...config }
  
  // Add timestamp
  const logEntry: AuditLogEntry = {
    ...entry,
    timestamp: new Date().toISOString()
  }

  // Sanitize sensitive data
  if (logEntry.details) {
    logEntry.details = sanitizeSensitiveData(logEntry.details, finalConfig.sensitiveFields)
  }

  // Log to console (development)
  if (finalConfig.enableConsole) {
    logToConsole(logEntry)
  }

  // Add to buffer for database logging
  if (finalConfig.enableDatabase) {
    logBuffer.push(logEntry)
    
    if (logBuffer.length >= BUFFER_SIZE) {
      await flushLogBuffer()
    }
  }

  // Log to file (production)
  if (finalConfig.enableFile) {
    await logToFile(logEntry)
  }

  // Send alerts for critical events
  if (shouldAlert(logEntry)) {
    await sendAlert(logEntry)
  }
}

function logToConsole(entry: AuditLogEntry) {
  const colorMap = {
    LOGIN_SUCCESS: '\x1b[32m', // Green
    LOGIN_FAILURE: '\x1b[31m', // Red
    REGISTER_SUCCESS: '\x1b[36m', // Cyan
    SECURITY_VIOLATION: '\x1b[35m', // Magenta
    ERROR: '\x1b[31m', // Red
    DEFAULT: '\x1b[0m' // Reset
  }

  const color = Object.keys(colorMap).find(key => 
    entry.event.includes(key)
  ) || 'DEFAULT'

  const timestamp = entry.timestamp
  const status = entry.success ? 'âœ…' : 'âŒ'
  const userInfo = entry.email ? `[${entry.email}]` : entry.userId ? `[${entry.userId}]` : '[Anonymous]'
  
  console.log(
    `${colorMap[color as keyof typeof colorMap]}[${timestamp}] ${status} ${entry.event} ${userInfo}${colorMap.DEFAULT}`,
    entry.details ? `\nDetails: ${JSON.stringify(entry.details, null, 2)}` : ''
  )
}

async function logToFile(entry: AuditLogEntry) {
  // In a real implementation, you would write to a file
  // This is a placeholder for file logging
  /*
  const fs = require('fs').promises
  const path = require('path')
  
  const logDir = path.join(process.cwd(), 'logs')
  const logFile = path.join(logDir, `audit-${new Date().toISOString().split('T')[0]}.log`)
  
  try {
    await fs.mkdir(logDir, { recursive: true })
    await fs.appendFile(logFile, JSON.stringify(entry) + '\n')
  } catch (error) {
    console.error('Failed to write audit log to file:', error)
  }
  */
}

async function flushLogBuffer() {
  if (logBuffer.length === 0) return

  const entriesToFlush = logBuffer.splice(0, logBuffer.length)
  
  try {
    await saveToDabase(entriesToFlush)
  } catch (error) {
    console.error('Failed to flush audit log buffer:', error)
    // Re-add entries to buffer for retry (with limit to prevent memory leak)
    if (logBuffer.length < 1000) {
      logBuffer.unshift(...entriesToFlush)
    }
  }
}

async function saveToDabase(entries: AuditLogEntry[]) {
  // Database implementation - replace with your database choice
  /*
  // Example with Prisma
  await prisma.auditLog.createMany({
    data: entries.map(entry => ({
      event: entry.event,
      userId: entry.userId,
      email: entry.email,
      ip: entry.ip,
      userAgent: entry.userAgent,
      success: entry.success,
      details: entry.details ? JSON.stringify(entry.details) : null,
      timestamp: new Date(entry.timestamp!)
    }))
  })
  */
  
  // Example with MongoDB
  /*
  const { MongoClient } = require('mongodb')
  const client = new MongoClient(process.env.MONGODB_URL)
  
  try {
    await client.connect()
    const db = client.db('auth_system')
    await db.collection('audit_logs').insertMany(entries)
  } finally {
    await client.close()
  }
  */
  
  // For now, just log that we would save to database
  console.log(`Would save ${entries.length} audit log entries to database`)
}

function sanitizeSensitiveData(data: any, sensitiveFields: string[]): any {
  if (!data || typeof data !== 'object') return data

  const sanitized = { ...data }
  
  for (const field of sensitiveFields) {
    if (field in sanitized) {
      if (typeof sanitized[field] === 'string' && sanitized[field].length > 0) {
        // Show first 3 and last 3 characters with *** in between
        const value = sanitized[field]
        if (value.length > 10) {
          sanitized[field] = `${value.slice(0, 3)}***${value.slice(-3)}`
        } else {
          sanitized[field] = '***'
        }
      } else {
        sanitized[field] = '[REDACTED]'
      }
    }
  }

  // Recursively sanitize nested objects
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeSensitiveData(sanitized[key], sensitiveFields)
    }
  }

  return sanitized
}

function shouldAlert(entry: AuditLogEntry): boolean {
  const alertEvents = [
    'LOGIN_RATE_LIMITED',
    'MULTIPLE_FAILED_LOGINS',
    'SECURITY_VIOLATION',
    'ADMIN_ACTION_FAILED',
    'SUSPICIOUS_ACTIVITY',
    'ACCOUNT_LOCKOUT',
    'UNAUTHORIZED_ACCESS_ATTEMPT'
  ]

  return alertEvents.some(event => entry.event.includes(event)) && !entry.success
}

async function sendAlert(entry: AuditLogEntry) {
  // Alert implementation - replace with your alerting system
  /*
  // Example with email
  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `Security Alert: ${entry.event}`,
    body: `
      Event: ${entry.event}
      User: ${entry.email || entry.userId || 'Unknown'}
      IP: ${entry.ip}
      Time: ${entry.timestamp}
      Details: ${JSON.stringify(entry.details, null, 2)}
    `
  })
  */

  // Example with Slack
  /*
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `ðŸš¨ Security Alert: ${entry.event}`,
      attachments: [{
        color: 'danger',
        fields: [
          { title: 'User', value: entry.email || entry.userId || 'Unknown', short: true },
          { title: 'IP', value: entry.ip || 'Unknown', short: true },
          { title: 'Time', value: entry.timestamp, short: true },
          { title: 'Details', value: JSON.stringify(entry.details), short: false }
        ]
      }]
    })
  })
  */

  console.warn(`ðŸš¨ SECURITY ALERT: ${entry.event}`, entry)
}

// Specialized logging functions
export const securityLog = {
  suspiciousActivity: (details: any) => auditLog({
    event: 'SUSPICIOUS_ACTIVITY',
    success: false,
    details
  }),

  unauthorizedAccess: (userId: string, resource: string, ip: string) => auditLog({
    event: 'UNAUTHORIZED_ACCESS_ATTEMPT',
    userId,
    ip,
    success: false,
    details: { resource, attemptedAction: 'access' }
  }),

  multipleFailedLogins: (email: string, ip: string, attemptCount: number) => auditLog({
    event: 'MULTIPLE_FAILED_LOGINS',
    email,
    ip,
    success: false,
    details: { attemptCount, threshold: 5 }
  }),

  accountLockout: (userId: string, email: string, reason: string) => auditLog({
    event: 'ACCOUNT_LOCKOUT',
    userId,
    email,
    success: false,
    details: { reason, lockoutDuration: '30 minutes' }
  })
}

// Performance logging
export const performanceLog = {
  slowQuery: (query: string, duration: number, threshold: number = 1000) => {
    if (duration > threshold) {
      auditLog({
        event: 'SLOW_QUERY_DETECTED',
        success: false,
        details: { query, duration, threshold }
      })
    }
  },

  apiResponse: (endpoint: string, method: string, duration: number, statusCode: number) => auditLog({
    event: 'API_RESPONSE_TIME',
    success: statusCode < 400,
    details: { endpoint, method, duration, statusCode }
  })
}

// Business logic logging
export const businessLog = {
  userRegistration: (userId: string, email: string, role: string) => auditLog({
    event: 'USER_REGISTRATION',
    userId,
    email,
    success: true,
    details: { role, source: 'web' }
  }),

  roleChange: (adminId: string, targetUserId: string, oldRole: string, newRole: string) => auditLog({
    event: 'USER_ROLE_CHANGED',
    userId: adminId,
    success: true,
    details: { targetUserId, oldRole, newRole }
  }),

  permissionGranted: (adminId: string, userId: string, permission: string) => auditLog({
    event: 'PERMISSION_GRANTED',
    userId: adminId,
    success: true,
    details: { targetUserId: userId, permission }
  })
}

// Export main function and utilities
export type { AuditLogEntry, AuditLogConfig }

// Cleanup on process exit
if (typeof process !== 'undefined') {
  process.on('exit', () => {
    if (flushTimer) {
      clearInterval(flushTimer)
    }
    // Final flush
    if (logBuffer.length > 0) {
      console.log(`Flushing ${logBuffer.length} remaining audit log entries...`)
      // Note: This should be synchronous in a real implementation
    }
  })
}


