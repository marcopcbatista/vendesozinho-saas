import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { auditLog } from '@/lib/audit-log'
import { getUserById, updateUserProfile, updateUserPassword } from '@/lib/database'
import { uploadAvatar } from '@/lib/storage'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'
)

// Validation schemas
const updateProfileSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .optional(),
  phone: z.string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone invÃ¡lido')
    .optional()
    .nullable(),
  avatar: z.string().url('URL do avatar invÃ¡lida').optional().nullable()
})

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual Ã© obrigatÃ³ria'),
  newPassword: z.string()
    .min(8, 'Nova senha deve ter pelo menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Nova senha deve conter: maiÃºscula, minÃºscula, nÃºmero e sÃ­mbolo')
})

// GET - Get current user info
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  try {
    // Get access token from cookie or Authorization header
    const accessToken = request.cookies.get('accessToken')?.value ||
                       request.headers.get('authorization')?.replace('Bearer ', '')

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token not provided' },
        { status: 401 }
      )
    }

    // Verify token
    let payload: any
    try {
      const verificationResult = await jwtVerify(accessToken, JWT_SECRET)
      payload = verificationResult.payload
    } catch (error) {
      await auditLog({
        event: 'GET_ME_TOKEN_INVALID',
        ip,
        userAgent,
        success: false,
        details: { error: 'Token verification failed' }
      })
      
      return NextResponse.json(
        { error: 'Invalid or expired access token' },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await getUserById(payload.userId as string)
    
    if (!user) {
      await auditLog({
        event: 'GET_ME_USER_NOT_FOUND',
        userId: payload.userId,
        ip,
        userAgent,
        success: false
      })
      
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is still active
    if (!user.isActive) {
      await auditLog({
        event: 'GET_ME_USER_INACTIVE',
        userId: user.id,
        email: user.email,
        ip,
        userAgent,
        success: false
      })
      
      return NextResponse.json(
        { error: 'User account is deactivated' },
        { status: 401 }
      )
    }

    // Prepare user data (exclude sensitive fields)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      permissions: user.permissions,
      avatar: user.avatar,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    await auditLog({
      event: 'GET_ME_SUCCESS',
      userId: user.id,
      email: user.email,
      ip,
      userAgent,
      success: true,
      details: { 
        responseTime: Date.now() - startTime 
      }
    })

    return NextResponse.json({
      success: true,
      user: userData
    })

  } catch (error: any) {
    console.error('Get Me API Error:', error)
    
    await auditLog({
      event: 'GET_ME_SERVER_ERROR',
      ip,
      userAgent,
      success: false,
      details: { 
        error: error.message,
        responseTime: Date.now() - startTime
      }
    })

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  const startTime = Date.now()
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  try {
    // Get and verify access token
    const accessToken = request.cookies.get('accessToken')?.value ||
                       request.headers.get('authorization')?.replace('Bearer ', '')

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token not provided' },
        { status: 401 }
      )
    }

    let payload: any
    try {
      const verificationResult = await jwtVerify(accessToken, JWT_SECRET)
      payload = verificationResult.payload
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired access token' },
        { status: 401 }
      )
    }

    // Get current user
    const user = await getUserById(payload.userId as string)
    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const url = new URL(request.url)
    const updateType = url.searchParams.get('type') || 'profile'

    if (updateType === 'password') {
      return await handlePasswordUpdate(body, user, ip, userAgent, startTime)
    } else {
      return await handleProfileUpdate(body, user, ip, userAgent, startTime)
    }

  } catch (error: any) {
    console.error('Update Profile API Error:', error)
    
    await auditLog({
      event: 'UPDATE_PROFILE_SERVER_ERROR',
      ip,
      userAgent,
      success: false,
      details: { 
        error: error.message,
        responseTime: Date.now() - startTime
      }
    })

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleProfileUpdate(
  body: any, 
  user: any, 
  ip: string, 
  userAgent: string, 
  startTime: number
) {
  // Validate input
  const validationResult = updateProfileSchema.safeParse(body)

  if (!validationResult.success) {
    await auditLog({
      event: 'UPDATE_PROFILE_VALIDATION_ERROR',
      userId: user.id,
      email: user.email,
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

  const updateData = validationResult.data

  // Update user profile in database
  const updatedUser = await updateUserProfile(user.id, updateData)

  await auditLog({
    event: 'UPDATE_PROFILE_SUCCESS',
    userId: user.id,
    email: user.email,
    ip,
    userAgent,
    success: true,
    details: { 
      updatedFields: Object.keys(updateData),
      responseTime: Date.now() - startTime 
    }
  })

  return NextResponse.json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      permissions: updatedUser.permissions,
      avatar: updatedUser.avatar,
      isActive: updatedUser.isActive,
      emailVerified: updatedUser.emailVerified,
      lastLoginAt: updatedUser.lastLoginAt,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    }
  })
}

async function handlePasswordUpdate(
  body: any, 
  user: any, 
  ip: string, 
  userAgent: string, 
  startTime: number
) {
  // Validate input
  const validationResult = updatePasswordSchema.safeParse(body)

  if (!validationResult.success) {
    await auditLog({
      event: 'UPDATE_PASSWORD_VALIDATION_ERROR',
      userId: user.id,
      email: user.email,
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

  const { currentPassword, newPassword } = validationResult.data

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.hashedPassword)
  
  if (!isCurrentPasswordValid) {
    await auditLog({
      event: 'UPDATE_PASSWORD_WRONG_CURRENT',
      userId: user.id,
      email: user.email,
      ip,
      userAgent,
      success: false
    })
    
    return NextResponse.json(
      { error: 'Current password is incorrect' },
      { status: 400 }
    )
  }

  // Check if new password is different from current
  const isSamePassword = await bcrypt.compare(newPassword, user.hashedPassword)
  if (isSamePassword) {
    return NextResponse.json(
      { error: 'New password must be different from current password' },
      { status: 400 }
    )
  }

  // Hash new password
  const saltRounds = 12
  const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

  // Update password in database
  await updateUserPassword(user.id, hashedNewPassword)

  await auditLog({
    event: 'UPDATE_PASSWORD_SUCCESS',
    userId: user.id,
    email: user.email,
    ip,
    userAgent,
    success: true,
    details: { 
      responseTime: Date.now() - startTime 
    }
  })

  return NextResponse.json({
    success: true,
    message: 'Password updated successfully'
  })
}

// POST - Upload avatar
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  try {
    // Get and verify access token
    const accessToken = request.cookies.get('accessToken')?.value ||
                       request.headers.get('authorization')?.replace('Bearer ', '')

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token not provided' },
        { status: 401 }
      )
    }

    let payload: any
    try {
      const verificationResult = await jwtVerify(accessToken, JWT_SECRET)
      payload = verificationResult.payload
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired access token' },
        { status: 401 }
      )
    }

    // Get current user
    const user = await getUserById(payload.userId as string)
    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      )
    }

    // Handle file upload
    const formData = await request.formData()
    const file = formData.get('avatar') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      )
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Upload avatar
    const avatarUrl = await uploadAvatar(file, user.id)

    // Update user avatar in database
    const updatedUser = await updateUserProfile(user.id, { avatar: avatarUrl })

    await auditLog({
      event: 'AVATAR_UPLOAD_SUCCESS',
      userId: user.id,
      email: user.email,
      ip,
      userAgent,
      success: true,
      details: { 
        avatarUrl,
        fileSize: file.size,
        fileType: file.type,
        responseTime: Date.now() - startTime 
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Avatar updated successfully',
      avatar: avatarUrl
    })

  } catch (error: any) {
    console.error('Avatar Upload API Error:', error)
    
    await auditLog({
      event: 'AVATAR_UPLOAD_SERVER_ERROR',
      ip,
      userAgent,
      success: false,
      details: { 
        error: error.message,
        responseTime: Date.now() - startTime
      }
    })

    return NextResponse.json(
      { error: 'Internal server error during avatar upload' },
      { status: 500 }
    )
  }
}

