import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types
export interface User {
  id: string;
  email: string;
  phone?: string;
  full_name?: string;
  password_hash: string;
  email_verified: boolean;
  phone_verified: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface RefreshToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  created_at: Date;
}

export interface PasswordResetToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  created_at: Date;
  used: boolean;
}

export interface EmailVerificationToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  created_at: Date;
}

// User Functions
export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;
  return data as User;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (error || !data) return null;
  return data as User;
}

export async function getUserByPhone(phone: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('phone', phone)
    .single();

  if (error || !data) return null;
  return data as User;
}

export async function createUser(userData: {
  email: string;
  password: string;
  phone?: string;
  full_name?: string;
}): Promise<User | null> {
  const passwordHash = await bcrypt.hash(userData.password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert({
      email: userData.email.toLowerCase(),
      phone: userData.phone,
      full_name: userData.full_name,
      password_hash: passwordHash,
      email_verified: false,
      phone_verified: false,
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Error creating user:', error);
    return null;
  }

  return data as User;
}

export async function updateUserProfile(
  userId: string,
  updates: {
    full_name?: string;
    phone?: string;
    email?: string;
  }
): Promise<boolean> {
  const updateData: any = {};

  if (updates.full_name !== undefined) updateData.full_name = updates.full_name;
  if (updates.phone !== undefined) updateData.phone = updates.phone;
  if (updates.email !== undefined) updateData.email = updates.email.toLowerCase();

  updateData.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId);

  return !error;
}

export async function updateUserPassword(
  userId: string,
  newPassword: string
): Promise<boolean> {
  const passwordHash = await bcrypt.hash(newPassword, 10);

  const { error } = await supabase
    .from('users')
    .update({
      password_hash: passwordHash,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  return !error;
}

export async function verifyUserPassword(
  userId: string,
  password: string
): Promise<boolean> {
  const user = await getUserById(userId);
  if (!user) return false;

  return bcrypt.compare(password, user.password_hash);
}

// Refresh Token Functions
export async function createRefreshToken(
  userId: string,
  token: string,
  expiresInDays: number = 30
): Promise<RefreshToken | null> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  const { data, error } = await supabase
    .from('refresh_tokens')
    .insert({
      user_id: userId,
      token,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error || !data) return null;
  return data as RefreshToken;
}

export async function isRefreshTokenValid(token: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('refresh_tokens')
    .select('*')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single();

  return !error && !!data;
}

export async function getRefreshToken(token: string): Promise<RefreshToken | null> {
  const { data, error } = await supabase
    .from('refresh_tokens')
    .select('*')
    .eq('token', token)
    .single();

  if (error || !data) return null;
  return data as RefreshToken;
}

export async function updateRefreshToken(
  oldToken: string,
  newToken: string,
  expiresInDays: number = 30
): Promise<boolean> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  const { error } = await supabase
    .from('refresh_tokens')
    .update({
      token: newToken,
      expires_at: expiresAt.toISOString(),
    })
    .eq('token', oldToken);

  return !error;
}

export async function revokeRefreshToken(token: string): Promise<boolean> {
  const { error } = await supabase
    .from('refresh_tokens')
    .delete()
    .eq('token', token);

  return !error;
}

export async function revokeAllUserRefreshTokens(userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('refresh_tokens')
    .delete()
    .eq('user_id', userId);

  return !error;
}

// Session Management
export async function invalidateUserSessions(userId: string): Promise<boolean> {
  // Revoke all refresh tokens for the user
  const tokensRevoked = await revokeAllUserRefreshTokens(userId);
  
  // You can add more session invalidation logic here if needed
  // For example, adding the user to a blacklist table temporarily
  
  return tokensRevoked;
}

// Password Reset Token Functions
export async function createPasswordResetToken(
  userId: string,
  token: string,
  expiresInHours: number = 1
): Promise<PasswordResetToken | null> {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresInHours);

  const { data, error } = await supabase
    .from('password_reset_tokens')
    .insert({
      user_id: userId,
      token,
      expires_at: expiresAt.toISOString(),
      used: false,
    })
    .select()
    .single();

  if (error || !data) return null;
  return data as PasswordResetToken;
}

export async function getPasswordResetToken(token: string): Promise<PasswordResetToken | null> {
  const { data, error } = await supabase
    .from('password_reset_tokens')
    .select('*')
    .eq('token', token)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !data) return null;
  return data as PasswordResetToken;
}

export async function markPasswordResetTokenAsUsed(token: string): Promise<boolean> {
  const { error } = await supabase
    .from('password_reset_tokens')
    .update({ used: true })
    .eq('token', token);

  return !error;
}

// Email Verification Token Functions
export async function createEmailVerificationToken(
  userId: string,
  token: string,
  expiresInHours: number = 24
): Promise<EmailVerificationToken | null> {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresInHours);

  const { data, error } = await supabase
    .from('email_verification_tokens')
    .insert({
      user_id: userId,
      token,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error || !data) return null;
  return data as EmailVerificationToken;
}

export async function getEmailVerificationToken(token: string): Promise<EmailVerificationToken | null> {
  const { data, error } = await supabase
    .from('email_verification_tokens')
    .select('*')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !data) return null;
  return data as EmailVerificationToken;
}

export async function markEmailAsVerified(userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .update({
      email_verified: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  return !error;
}

export async function deleteEmailVerificationToken(token: string): Promise<boolean> {
  const { error } = await supabase
    .from('email_verification_tokens')
    .delete()
    .eq('token', token);

  return !error;
}



