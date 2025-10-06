import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify, SignJWT } from 'jose'
import { auditLog } from '@/lib/audit-log'
import { getUserById, isRefreshTokenValid, updateRefreshToken } from '@/lib/database'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'
)

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  try {
    // Get refresh token from cookie or body
    const refreshToken = request.cookies.get('refreshToken')?.value

    if (!refreshToken) {
      await auditLog({
        event: 'REFRESH_TOKEN_MISSING',
        ip,
        userAgent,
        success: false
      })
      
      return NextResponse.json(
        { error: 'Refresh token not provided' },
        { status: 401 }
      )
    }

    // Verify refresh token
    let payload: any
    try {
      const verificationResult = await jwtVerify(refreshToken, JWT_SECRET)
      payload = verificationResult.payload
    } catch (error) {
      await auditLog({
        event: 'REFRESH_TOKEN_INVALID',
        ip,
        userAgent,
        success: false,
        details: { error: 'Token verification failed' }
      })
      
      // Clear invalid refresh token cookie
      const response = NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      )
      
      response.cookies.set('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0
      })
      
      return response
    }

    // Validate token type and required fields
    if (payload.type !== 'refresh' || !payload.userId) {
      await auditLog({
        event: 'REFRESH_TOKEN_MALFORMED',
        ip,
        userAgent,
        success: false,
        details: { tokenType: payload.type }
      })
      
      return NextResponse.json(
        { error: 'Invalid token type' },
        { status: 401 }
      )
    }

    // Check if refresh token is still valid in database (not revoked)
    const isTokenValid = await isRefreshTokenValid(refreshToken)
    if (!isTokenValid) {
      await auditLog({
        event: 'REFRESH_TOKEN_REVOKED',
        userId: payload.userId,
        ip,
        userAgent,
        success: false
      })
      
      return NextResponse.json(
        { error: 'Refresh token has been revoked' },
        { status: 401 }
      )
    }

    // Get user data
    const user = await getUserById(payload.userId)
    if (!user) {
      await auditLog({
        event: 'REFRESH_USER_NOT_FOUND',
        userId: payload.userId,
        ip,
        userAgent,
        success: false
      })
      
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    // Check if user is still active
    if (!user.isActive) {
      await auditLog({
        event: 'REFRESH_USER_INACTIVE',
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

    // Generate new access token
    const newAccessToken = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      sessionId: payload.sessionId || generateSessionId()
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET)

    // Optionally rotate refresh token (recommended for security)
    let newRefreshToken = refreshToken
    const shouldRotateRefreshToken = process.env.ROTATE_REFRESH_TOKENS === 'true'
    
    if (shouldRotateRefreshToken) {
      newRefreshToken = await new SignJWT({
        userId: user.id,
        sessionId: payload.sessionId || generateSessionId(),
        type: 'refresh'
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET)

      // Update refresh token in database
      await updateRefreshToken(refreshToken, newRefreshToken)
    }

    // Prepare user data for response
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
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
      event: 'REFRESH_TOKEN_SUCCESS',
      userId: user.id,
      email: user.email,
      ip,
      userAgent,
      success: true,
      details: { 
        tokenRotated: shouldRotateRefreshToken,
        responseTime: Date.now() - startTime 
      }
    })

    // Create response
    const response = NextResponse.json({
      success: true,
      user: userData,
      accessToken: newAccessToken,
      expiresIn: 86400 // 24 hours in seconds
    })

    // Set new access token cookie
    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    // Set new refresh token cookie if rotated
    if (shouldRotateRefreshToken && newRefreshToken !== refreshToken) {
      response.cookies.set('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      })
    }

    return response

  } catch (error: any) {
    console.error('Token refresh API Error:', error)
    
    await auditLog({
      event: 'REFRESH_TOKEN_SERVER_ERROR',
      ip,
      userAgent,
      success: false,
      details: { 
        error: error.message,
        responseTime: Date.now() - startTime
      }
    })

    return NextResponse.json(
      { error: 'Internal server error during token refresh' },
      { status: 500 }
    )
  }
}

// Helper function
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

