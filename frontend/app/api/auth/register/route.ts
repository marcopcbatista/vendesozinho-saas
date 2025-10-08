import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'
import { auditLog } from '@/lib/audit-log'
import { createUser, getUserByEmail, getUserByPhone } from '@/lib/database'
import { sendWelcomeEmail } from '@/lib/email'

// Validation schema
const registerSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),

  email: z.string()
    .email('Email invÃ¡lido')
    .max(255, 'Email muito longo'),
  phone: z.string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone invÃ¡lido')
    .optional(),
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Senha deve conter: maiÃºscula, minÃºscula, nÃºmero e sÃ­mbolo')
})

// JWT secret
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'
)

// Rate limiting
const registerRateLimit = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 100,
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  try {
    // Rate limiting - 3 registrations per hour per IP
    const rateLimitResult = await registerRateLimit.check(3, ip)
    
    if (!rateLimitResult.success) {
      await auditLog({
        event: 'REGISTER_RATE_LIMITED',
        ip,
        userAgent,
        success: false,
        details: { remaining: rateLimitResult.remaining }
      })
      
      return NextResponse.json(
        { 
          error: 'Too many registration attempts. Please try again later.',
          retryAfter: Math.ceil(rateLimitResult.reset / 1000)
        },
        { status: 429 }
      )
    }

    // Parse and validate request
    const body = await request.json()
    const validationResult = registerSchema.safeParse(body)

    if (!validationResult.success) {
      await auditLog({
        event: 'REGISTER_VALIDATION_ERROR',
        ip,
        userAgent,
        success: false,
        details: { errors: validationResult.error.issues }
      })
      
      return NextResponse.json(
        { 
          error: 'Invalid input data',
          details: validationResult.error.issues 
        },
        { status: 400 }
      )
    }

    const { name, email, phone, password } = validationResult.data

    // Check if email already exists
    const existingEmailUser = await getUserByEmail(email.toLowerCase())
    if (existingEmailUser) {
      await auditLog({
        event: 'REGISTER_EMAIL_EXISTS',
        email: email.toLowerCase(),
        ip,
        userAgent,
        success: false
      })
      
      return NextResponse.json(
        { error: 'Email already registered. Please use a different email or login.' },
        { status: 409 }
      )
    }

    // Check if phone already exists (if provided)
    if (phone) {
      const existingPhoneUser = await getUserByPhone(phone)
      if (existingPhoneUser) {
        await auditLog({
          event: 'REGISTER_PHONE_EXISTS',
          ip,
          userAgent,
          success: false
        })
        
        return NextResponse.json(
          { error: 'Phone number already registered. Please use a different number.' },
          { status: 409 }
        )
      }
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Determine default role (could be configurable)
    const defaultRole = process.env.DEFAULT_USER_ROLE || 'viewer'
    
    // Create user in database
    const newUser = await createUser({
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone || null,
      hashedPassword,
      role: defaultRole as any,
      isActive: true,
      emailVerified: false, // Will be verified via email
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      registrationIp: ip,
      registrationUserAgent: userAgent
    })

    // Generate JWT tokens
    const accessToken = await new SignJWT({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      permissions: newUser.permissions,
      sessionId: generateSessionId()
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET)

    const refreshToken = await new SignJWT({
      userId: newUser.id,
      sessionId: generateSessionId(),
      type: 'refresh'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    // Store refresh token
    await storeRefreshToken(newUser.id, refreshToken, '7d')

    // Generate email verification token
    const emailVerificationToken = await new SignJWT({
      userId: newUser.id,
      email: newUser.email,
      type: 'email_verification'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET)

    // Store verification token
    await storeVerificationToken(newUser.id, emailVerificationToken)

    // Send welcome email with verification link
    try {
      await sendWelcomeEmail({
        to: newUser.email,
        name: newUser.name,
        verificationToken: emailVerificationToken
      })
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail registration if email fails, just log it
      await auditLog({
        event: 'REGISTER_EMAIL_SEND_FAILED',
        userId: newUser.id,
        email: newUser.email,
        success: false,
        details: { error: emailError }
      })
    }

    // Prepare response data
    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      permissions: newUser.permissions,
      avatar: newUser.avatar,
      isActive: newUser.isActive,
      emailVerified: newUser.emailVerified,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    }

    await auditLog({
      event: 'REGISTER_SUCCESS',
      userId: newUser.id,
      email: newUser.email,
      ip,
      userAgent,
      success: true,
      details: { 
        role: newUser.role,
        hasPhone: !!phone,
        responseTime: Date.now() - startTime 
      }
    })

    // Set cookies and return response
    const response = NextResponse.json({
      success: true,
      user: userData,
      accessToken,
      message: 'Account created successfully! Please check your email to verify your account.',
      emailVerificationRequired: true
    })

    // Set secure cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    }

    response.cookies.set('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 // 24 hours
    })

    response.cookies.set('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response

  } catch (error: any) {
    console.error('Registration API Error:', error)
    
    await auditLog({
      event: 'REGISTER_SERVER_ERROR',
      ip,
      userAgent,
      success: false,
      details: { 
        error: error.message,
        stack: error.stack,
        responseTime: Date.now() - startTime
      }
    })

    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}

// Helper functions
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

async function storeRefreshToken(userId: string, token: string, expiresIn: string) {
  // Store refresh token for session management
  // Implementation depends on your database choice
}

async function storeVerificationToken(userId: string, token: string) {
  // Store email verification token
  // Implementation depends on your database choice
}




