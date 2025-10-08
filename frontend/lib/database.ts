import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'

import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
    
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
// ========================================================
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
// ✅ Exportações principais do módulo de banco de dados
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
// ========================================================
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'

import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'

import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
export type {
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  User,
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  RefreshToken,
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  PasswordResetToken,
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  EmailVerificationToken
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
}
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
    
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
// === DB FUNCTIONS START ===
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
// 🔹 Funções simuladas de banco de dados em memória
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
import type { User, RefreshToken } from '@/types/auth'
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'

import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
const db = {
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  users: new Map<string, User>(),
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  refreshTokens: new Map<string, RefreshToken>()
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
}
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'

import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
export async function getUserById(id: string): Promise<User | null> {
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  return db.users.get(id) || null
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
}
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'

import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
export async function getUserByEmail(email: string): Promise<User | null> {
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  for (const user of db.users.values()) {
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
    if (user.email === email) return user
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  }
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  return null
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
}
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'

import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
export async function getUserByPhone(phone: string): Promise<User | null> {
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  for (const user of db.users.values()) {
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
    if (user.phone === phone) return user
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  }
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  return null
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
}
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'

import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
export async function createUser(data: Omit<User, 'id' | 'permissions' | 'password'>): Promise<User> {
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  const id = `user-${Math.random().toString(36).substring(2, 9)}`
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  const newUser: User = { ...data, id, password: '', permissions: [] }
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  db.users.set(id, newUser)
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  return newUser
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
}
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'

import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
export async function updateUserProfile(id: string, updates: Partial<User>): Promise<User | null> {
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  const user = db.users.get(id)
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  if (!user) return null
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() }
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  db.users.set(id, updatedUser)
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  return updatedUser
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
}
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'

import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
export async function updateUserPassword(id: string, hashedPassword: string): Promise<User | null> {
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  const user = db.users.get(id)
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  if (!user) return null
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  const updatedUser = { ...user, hashedPassword }
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  db.users.set(id, updatedUser)
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  return updatedUser
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
}
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'

import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
export async function revokeRefreshToken(token: string): Promise<boolean> {
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  return db.refreshTokens.delete(token)
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
}
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'

import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
export async function invalidateUserSessions(userId: string): Promise<void> {
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  for (const [token, rt] of db.refreshTokens.entries()) {
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
    if (rt.userId === userId) db.refreshTokens.delete(token)
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  }
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
}
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'

import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
export async function updateRefreshToken(token: string, userId: string): Promise<void> {
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  const newToken: RefreshToken = { token, userId, createdAt: new Date().toISOString() }
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  db.refreshTokens.set(token, newToken)
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
}
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'

import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
export async function isRefreshTokenValid(token: string): Promise<boolean> {
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
  return db.refreshTokens.has(token)
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
}
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'

import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
// ✅ Exportações principais
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'

import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'
// === DB FUNCTIONS END ===
import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'

import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'

import type { PasswordResetToken, EmailVerificationToken } from '@/types/auth'

