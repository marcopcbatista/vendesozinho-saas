import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { auditLog } from '@/lib/audit-log'
import { revokeRefreshToken, invalidateUserSessions } from '@/lib/database'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'
)

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  try {
    // Get tokens from cookies or Authorization header
    const accessToken = request.cookies.get('accessToken')?.value ||
                       request.headers.get('authorization')?.replace('Bearer ', '')
    
    const refreshToken = request.cookies.get('refreshToken')?.value

    let userId: string | null = null
    let userEmail: string | null = null

    // Try to extract user info from access token
    if (accessToken) {
      try {
        const { payload } = await jwtVerify(accessToken, JWT_SECRET)
        userId = payload.userId as string
        userEmail = payload.email as string
      } catch (error) {
        // Token might be expired, but we still want to log the logout attempt
        console.log('Access token verification failed during logout:', error)
      }
    }

    // If no user info from access token, try refresh token
    if (!userId && refreshToken) {
      try {
        const { payload } = await jwtVerify(refreshToken, JWT_SECRET)
        userId = payload.userId as string
      } catch (error) {
        console.log('Refresh token verification failed during logout:', error)
      }
    }

    // Parse request body to check for logout type
    const body = await request.json().catch(() => ({}))
    const logoutAllSessions = body.logoutAllSessions === true

    // Revoke refresh token if available
    if (refreshToken) {
      try {
        await revokeRefreshToken(refreshToken)
      } catch (error) {
        console.error('Failed to revoke refresh token:', error)
      }
    }

    // If logging out from all sessions, invalidate all user sessions
    if (logoutAllSessions && userId) {
      try {
        await invalidateUserSessions(userId)
      } catch (error) {
        console.error('Failed to invalidate all user sessions:', error)
      }
    }

    // Log the logout event
    await auditLog({
      event: 'LOGOUT_SUCCESS',
      userId: userId || undefined,
      email: userEmail || undefined,
      ip,
      userAgent,
      success: true,
      details: { 
        logoutAllSessions,
        hadAccessToken: !!accessToken,
        hadRefreshToken: !!refreshToken,
        responseTime: Date.now() - startTime 
      }
    })

    // Create response
    const response = NextResponse.json({
      success: true,
      message: logoutAllSessions 
        ? 'Logged out from all sessions successfully' 
        : 'Logged out successfully'
    })

    // Clear authentication cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 0 // Immediately expire
    }

    response.cookies.set('accessToken', '', cookieOptions)
    response.cookies.set('refreshToken', '', cookieOptions)

    return response

  } catch (error: any) {
    console.error('Logout API Error:', error)
    
    await auditLog({
      event: 'LOGOUT_SERVER_ERROR',
      ip,
      userAgent,
      success: false,
      details: { 
        error: error.message,
        responseTime: Date.now() - startTime
      }
    })

    // Even if there's an error, clear the cookies to ensure logout
    const response = NextResponse.json(
      { error: 'Internal server error during logout. Cookies cleared.' },
      { status: 500 }
    )

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 0
    }

    response.cookies.set('accessToken', '', cookieOptions)
    response.cookies.set('refreshToken', '', cookieOptions)

    return response
  }
}

// Also support GET for simple logout links
export async function GET(request: NextRequest) {
  return POST(request)
}
