// Database abstraction layer - adapt to your database choice
// This file provides interfaces and mock implementations
// Replace with your actual database implementation (Prisma, MongoDB, etc.)

export interface User {
  id: string
  name: string
  email: string
  phone?: string | null
  hashedPassword: string
  role: 'viewer' | 'seller' | 'manager' | 'admin'
  permissions: string[]
  avatar?: string | null
  isActive: boolean
  emailVerified: boolean
  lastLoginAt?: string | null
  failedLoginAttempts?: number
  lockedUntil?: string | null
  createdAt: string
  updatedAt: string
  registrationIp?: string
  registrationUserAgent?: string
}

export interface RefreshToken {
  id: string
  userId: string
  token: string
  expiresAt: string
  used: boolean
  createdAt: string
}

export interface PasswordResetToken {
  id: string
  userId: string
  token: string
  used: boolean
  expiresAt: string
  createdAt: string
}

export interface EmailVerificationToken {
  id: string
  userId: string
  token: string
  used: boolean
  expiresAt: string
  createdAt: string
}

// Mock database (replace with your actual database implementation)
class MockDatabase {
  private users: Map<string, User> = new Map()
  private refreshTokens: Map<string, RefreshToken> = new Map()
  private resetTokens: Map<string, PasswordResetToken> = new Map()
  private verificationTokens: Map<string, EmailVerificationToken> = new Map()

  constructor() {
    this.seedData()
  }

  private seedData() {
    // Create a default admin user for testing
    const adminUser: User = {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@example.com',
      hashedPassword: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfUZKTHKiZoTMG2', // password123
      role: 'admin',
      permissions: [], // Will be populated by role
      isActive: true,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.users.set(adminUser.email, adminUser)
    this.users.set(adminUser.id, adminUser)
  }
}

const db = new MockDatabase()

// User operations
export async function createUser(userData: Omit<User, 'id' | 'permissions'>): Promise<User> {
  const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  // Get default permissions for role
  const permissions = getDefaultPermissionsForRole(userData.role)
  
  const user: User = {
    ...userData,
    id,
    permissions
  }

  // Store by both ID and email for easy lookup
  db['users'].set(user.id, user)
  db['users'].set(user.email, user)

  return user
}

export async function getUserById(id: string): Promise<User | null> {
  return db['users'].get(id) || null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return db['users'].get(email.toLowerCase()) || null
}

export async function getUserByPhone(phone: string): Promise<User | null> {
  // In a real database, you'd query by phone
  for (const user of db['users'].values()) {
    if (user.phone === phone) {
      return user
    }
  }
  return null
}

export async function updateUserLastLogin(userId: string, ip: string, userAgent: string): Promise<void> {
  const user = await getUserById(userId)
  if (user) {
    user.lastLoginAt = new Date().toISOString()
    user.updatedAt = new Date().toISOString()
    // Clear failed login attempts on successful login
    user.failedLoginAttempts = 0
    user.lockedUntil = null
    
    db['users'].set(userId, user)
    db['users'].set(user.email, user)
  }
}

export async function updateUserProfile(userId: string, updateData: Partial<Pick<User, 'name' | 'phone' | 'avatar'>>): Promise<User> {
  const user = await getUserById(userId)
  if (!user) {
    throw new Error('User not found')
  }

  const updatedUser: User = {
    ...user,
    ...updateData,
    updatedAt: new Date().toISOString()
  }

  db['users'].set(userId, updatedUser)
  db['users'].set(user.email, updatedUser)

  return updatedUser
}

export async function updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
  const user = await getUserById(userId)
  if (!user) {
    throw new Error('User not found')
  }

  user.hashedPassword = hashedPassword
  user.updatedAt = new Date().toISOString()

  db['users'].set(userId, user)
  db['users'].set(user.email, user)
}

export async function incrementFailedLoginAttempts(userId: string): Promise<void> {
  const user = await getUserById(userId)
  if (!user) return

  user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1
  user.updatedAt = new Date().toISOString()

  // Lock account after 5 failed attempts for 30 minutes
  if (user.failedLoginAttempts >= 5) {
    user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString()
  }

  db['users'].set(userId, user)
  db['users'].set(user.email, user)
}

export async function clearFailedLoginAttempts(userId: string): Promise<void> {
  const user = await getUserById(userId)
  if (!user) return

  user.failedLoginAttempts = 0
  user.lockedUntil = null
  user.updatedAt = new Date().toISOString()

  db['users'].set(userId, user)
  db['users'].set(user.email, user)
}

// Refresh token operations
export async function storeRefreshToken(userId: string, token: string, expiresIn: string): Promise<void> {
  const id = `rt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const expiresAt = calculateExpirationDate(expiresIn)
  
  const refreshToken: RefreshToken = {
    id,
    userId,
    token: hashToken(token), // Store hashed version
    expiresAt,
    used: false,
    createdAt: new Date().toISOString()
  }

  db['refreshTokens'].set(token, refreshToken)
}

export async function isRefreshTokenValid(token: string): Promise<boolean> {
  const refreshToken = db['refreshTokens'].get(token)
  if (!refreshToken) return false

  const now = new Date()
  const expiresAt = new Date(refreshToken.expiresAt)

  return !refreshToken.used && now < expiresAt
}

export async function revokeRefreshToken(token: string): Promise<void> {
  const refreshToken = db['refreshTokens'].get(token)
  if (refreshToken) {
    refreshToken.used = true
    db['refreshTokens'].set(token, refreshToken)
  }
}

export async function updateRefreshToken(oldToken: string, newToken: string): Promise<void> {
  await revokeRefreshToken(oldToken)
  
  const oldRefreshToken = db['refreshTokens'].get(oldToken)
  if (oldRefreshToken) {
    await storeRefreshToken(oldRefreshToken.userId, newToken, '7d')
  }
}

export async function invalidateUserSessions(userId: string): Promise<void> {
  // Mark all user's refresh tokens as used
  for (const [token, refreshToken] of db['refreshTokens'].entries()) {
    if (refreshToken.userId === userId && !refreshToken.used) {
      refreshToken.used = true
      db['refreshTokens'].set(token, refreshToken)
    }
  }
}

// Password reset token operations
export async function storePasswordResetToken(userId: string, token: string): Promise<void> {
  const id = `prt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const resetToken: PasswordResetToken = {
    id,
    userId,
    token: hashToken(token),
    used: false,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
    createdAt: new Date().toISOString()
  }

  // Remove any existing reset tokens for this user
  for (const [key, existingToken] of db['resetTokens'].entries()) {
    if (existingToken.userId === userId) {
      db['resetTokens'].delete(key)
    }
  }

  db['resetTokens'].set(token, resetToken)
}

export async function getPasswordResetToken(userId: string): Promise<PasswordResetToken | null> {
  for (const resetToken of db['resetTokens'].values()) {
    if (resetToken.userId === userId && !resetToken.used) {
      const now = new Date()
      const expiresAt = new Date(resetToken.expiresAt)
      
      if (now < expiresAt) {
        return resetToken
      }
    }
  }
  return null
}

export async function markPasswordResetTokenAsUsed(userId: string, token: string): Promise<void> {
  const resetToken = db['resetTokens'].get(token)
  if (resetToken && resetToken.userId === userId) {
    resetToken.used = true
    db['resetTokens'].set(token, resetToken)
  }
}

// Email verification token operations
export async function storeVerificationToken(userId: string, token: string): Promise<void> {
  const id = `vt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const verificationToken: EmailVerificationToken = {
    id,
    userId,
    token: hashToken(token),
    used: false,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    createdAt: new Date().toISOString()
  }

  db['verificationTokens'].set(token, verificationToken)
}

export async function verifyEmailToken(token: string): Promise<boolean> {
  const verificationToken = db['verificationTokens'].get(token)
  if (!verificationToken || verificationToken.used) {
    return false
  }

  const now = new Date()
  const expiresAt = new Date(verificationToken.expiresAt)
  
  if (now >= expiresAt) {
    return false
  }

  // Mark token as used
  verificationToken.used = true
  db['verificationTokens'].set(token, verificationToken)

  // Mark user email as verified
  const user = await getUserById(verificationToken.userId)
  if (user) {
    user.emailVerified = true
    user.updatedAt = new Date().toISOString()
    db['users'].set(user.id, user)
    db['users'].set(user.email, user)
  }

  return true
}

// Helper functions
function hashToken(token: string): string {
  // In production, use a proper hash function like crypto.createHash
  // This is a simple implementation for demo purposes
  return Buffer.from(token).toString('base64')
}

function calculateExpirationDate(expiresIn: string): string {
  const now = new Date()
  
  // Parse expiration string (e.g., "7d", "24h", "30m")
  const match = expiresIn.match(/^(\d+)([dhm])$/)
  if (!match) {
    throw new Error('Invalid expiration format. Use format like "7d", "24h", "30m"')
  }

  const [, amount, unit] = match
  const duration = parseInt(amount)

  switch (unit) {
    case 'd':
      return new Date(now.getTime() + duration * 24 * 60 * 60 * 1000).toISOString()
    case 'h':
      return new Date(now.getTime() + duration * 60 * 60 * 1000).toISOString()
    case 'm':
      return new Date(now.getTime() + duration * 60 * 1000).toISOString()
    default:
      throw new Error('Invalid time unit. Use d, h, or m')
  }
}

function getDefaultPermissionsForRole(role: User['role']): string[] {
  // This should match your permission system from the auth hook
  const rolePermissions: Record<User['role'], string[]> = {
    viewer: [
      'products:read',
      'orders:read',
      'customers:read',
      'reports:read'
    ],
    seller: [
      'products:read', 'products:create', 'products:update',
      'orders:read', 'orders:create', 'orders:update',
      'customers:read', 'customers:create', 'customers:update',
      'reports:read',
      'inventory:read', 'inventory:update'
    ],
    manager: [
      'products:read', 'products:create', 'products:update', 'products:delete', 'products:import', 'products:export',
      'orders:read', 'orders:create', 'orders:update', 'orders:delete', 'orders:export',
      'customers:read', 'customers:create', 'customers:update', 'customers:delete', 'customers:import', 'customers:export',
      'users:read', 'users:create', 'users:update',
      'reports:read', 'reports:create', 'reports:export',
      'inventory:read', 'inventory:create', 'inventory:update', 'inventory:import', 'inventory:export',
      'financial:read', 'financial:export',
      'settings:read', 'settings:update'
    ],
    admin: [
      // All permissions - full access
      'products:read', 'products:create', 'products:update', 'products:delete', 'products:import', 'products:export',
      'orders:read', 'orders:create', 'orders:update', 'orders:delete', 'orders:import', 'orders:export',
      'customers:read', 'customers:create', 'customers:update', 'customers:delete', 'customers:import', 'customers:export',
      'users:read', 'users:create', 'users:update', 'users:delete', 'users:import', 'users:export',
      'reports:read', 'reports:create', 'reports:update', 'reports:delete', 'reports:export',
      'settings:read', 'settings:create', 'settings:update', 'settings:delete',
      'inventory:read', 'inventory:create', 'inventory:update', 'inventory:delete', 'inventory:import', 'inventory:export',
      'financial:read', 'financial:create', 'financial:update', 'financial:delete', 'financial:import', 'financial:export',
      'marketing:read', 'marketing:create', 'marketing:update', 'marketing:delete', 'marketing:export',
      'support:read', 'support:create', 'support:update', 'support:delete',
      'analytics:read', 'analytics:create', 'analytics:export',
      'integrations:read', 'integrations:create', 'integrations:update', 'integrations:delete'
    ]
  }

  return rolePermissions[role] || []
}

// Database connection and setup (replace with your actual database)
export class DatabaseConnection {
  private static instance: DatabaseConnection
  private connected = false

  private constructor() {}

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection()
    }
    return DatabaseConnection.instance
  }

  async connect(): Promise<void> {
    if (this.connected) return

    // Replace with your actual database connection logic
    /*
    // Example with Prisma
    await prisma.$connect()
    
    // Example with MongoDB
    await mongoose.connect(process.env.MONGODB_URL!)
    
    // Example with PostgreSQL
    await pool.connect()
    */

    this.connected = true
    console.log('Database connected successfully')
  }

  async disconnect(): Promise<void> {
    if (!this.connected) return

    /*
    // Example disconnection
    await prisma.$disconnect()
    await mongoose.disconnect()
    await pool.end()
    */

    this.connected = false
    console.log('Database disconnected')
  }

  isConnected(): boolean {
    return this.connected
  }
}

// Initialize database connection
export const dbConnection = DatabaseConnection.getInstance()

// Migration and seeding functions
export async function runMigrations(): Promise<void> {
  console.log('Running database migrations...')
  
  // Add your migration logic here
  /*
  // Example with Prisma
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(20),
      hashed_password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'viewer',
      permissions TEXT,
      avatar TEXT,
      is_active BOOLEAN DEFAULT true,
      email_verified BOOLEAN DEFAULT false,
      last_login_at TIMESTAMP,
      failed_login_attempts INTEGER DEFAULT 0,
      locked_until TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `
  */
  
  console.log('Database migrations completed')
}

export async function seedDatabase(): Promise<void> {
  console.log('Seeding database with initial data...')
  
  // Check if admin user exists, create if not
  const adminUser = await getUserByEmail('admin@example.com')
  if (!adminUser) {
    await createUser({
      name: 'System Administrator',
      email: 'admin@example.com',
      hashedPassword: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfUZKTHKiZoTMG2', // password123
      role: 'admin',
      isActive: true,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    console.log('Admin user created: admin@example.com / password123')
  }

  console.log('Database seeding completed')
}

// Cleanup functions
export async function cleanupExpiredTokens(): Promise<void> {
  const now = new Date()

  // Clean expired refresh tokens
  for (const [token, refreshToken] of db['refreshTokens'].entries()) {
    if (new Date(refreshToken.expiresAt) < now) {
      db['refreshTokens'].delete(token)
    }
  }

  // Clean expired reset tokens
  for (const [token, resetToken] of db['resetTokens'].entries()) {
    if (new Date(resetToken.expiresAt) < now) {
      db['resetTokens'].delete(token)
    }
  }

  // Clean expired verification tokens
  for (const [token, verificationToken] of db['verificationTokens'].entries()) {
    if (new Date(verificationToken.expiresAt) < now) {
      db['verificationTokens'].delete(token)
    }
  }
}

// Run cleanup every hour
if (typeof window === 'undefined') { // Server-side only
  setInterval(cleanupExpiredTokens, 60 * 60 * 1000) // 1 hour
}

// Export types and interfaces
export type { User, RefreshToken, PasswordResetToken, EmailVerificationToken }
