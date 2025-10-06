import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// ===== CONFIGURAÃ‡Ã•ES =====
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

// Rotas que nÃ£o requerem autenticaÃ§Ã£o
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/verify-email',
  '/api/health',
  '/_next',
  '/favicon.ico',
  '/manifest.json',
  '/sw.js',
]

// Rotas que requerem autenticaÃ§Ã£o
const PROTECTED_ROUTES = [
  '/dashboard',
  '/products',
  '/orders',
  '/customers',
  '/reports',
  '/settings',
  '/profile',
  '/api/products',
  '/api/orders',
  '/api/customers',
  '/api/reports',
  '/api/users',
]

// Rotas administrativas (apenas admin)
const ADMIN_ROUTES = [
  '/admin',
  '/settings/users',
  '/settings/system',
  '/api/admin',
  '/api/users/create',
  '/api/users/delete',
  '/api/settings/system',
]

// Rotas por role especÃ­fico
const ROLE_ROUTES: Record<string, string[]> = {
  admin: [
    ...ADMIN_ROUTES,
    '/analytics/advanced',
    '/integrations',
    '/api/analytics/advanced',
    '/api/integrations',
  ],
  manager: [
    '/analytics',
    '/team',
    '/inventory/bulk',
    '/api/analytics',
    '/api/team',
    '/api/inventory/bulk',
  ],
  seller: [
    '/sales',
    '/my-customers',
    '/api/sales',
    '/api/my-customers',
  ],
}

// ===== INTERFACES =====
interface DecodedToken {
  userId: string
  email: string
  role: 'admin' | 'manager' | 'seller' | 'viewer'
  permissions: Array<{
    resource: string
    actions: string[]
  }>
  iat: number
  exp: number
}

interface RouteConfig {
  path: string
  requireAuth: boolean
  allowedRoles?: string[]
  redirectTo?: string
}

// ===== UTILITÃRIOS =====
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => {
    if (route === '/') return pathname === '/'
    if (route.startsWith('/_next')) return pathname.startsWith('/_next')
    return pathname.startsWith(route)
  })
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route))
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(route => pathname.startsWith(route))
}

function requiresSpecificRole(pathname: string): string | null {
  for (const [role, routes] of Object.entries(ROLE_ROUTES)) {
    if (routes.some(route => pathname.startsWith(route))) {
      return role
    }
  }
  return null
}

async function verifyToken(token: string): Promise<DecodedToken | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as DecodedToken
  } catch (error) {
    console.error('Erro ao verificar token:', error)
    return null
  }
}

function hasPermission(
  user: DecodedToken, 
  resource: string, 
  action: string = 'read'
): boolean {
  if (user.role === 'admin') return true
  
  return user.permissions.some(permission => 
    permission.resource === resource && 
    permission.actions.includes(action)
  )
}

function createRedirectResponse(request: NextRequest, redirectPath: string) {
  const redirectUrl = new URL(redirectPath, request.url)
  
  // Adicionar parÃ¢metro de redirect para retornar apÃ³s login
  if (redirectPath === '/login' && request.nextUrl.pathname !== '/login') {
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search)
  }
  
  const response = NextResponse.redirect(redirectUrl)
  
  // Limpar tokens invÃ¡lidos
  if (redirectPath === '/login') {
    response.cookies.delete('auth_token')
    response.cookies.delete('refresh_token')
  }
  
  return response
}

function logAccess(
  request: NextRequest, 
  user: DecodedToken | null, 
  action: string,
  success: boolean
) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${new Date().toISOString()}] ${action}:`, {
      path: request.nextUrl.pathname,
      method: request.method,
      userAgent: request.headers.get('user-agent'),
      ip: request.ip || request.headers.get('x-forwarded-for'),
      userId: user?.userId,
      userRole: user?.role,
      success,
    })
  }
}

// ===== MIDDLEWARE PRINCIPAL =====
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const method = request.method

  // Ignorar arquivos estÃ¡ticos e rotas do Next.js
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/_next') ||
    pathname.includes('.') && !pathname.startsWith('/api/')
  ) {
    return NextResponse.next()
  }

  // ===== 1. VERIFICAR SE Ã‰ ROTA PÃšBLICA =====
  if (isPublicRoute(pathname)) {
    // Para rotas de auth, redirecionar se jÃ¡ estiver logado
    if (['/login', '/register'].includes(pathname)) {
      const token = request.cookies.get('auth_token')?.value
      
      if (token) {
        const user = await verifyToken(token)
        if (user) {
          logAccess(request, user, 'REDIRECT_AUTHENTICATED', true)
          return createRedirectResponse(request, '/dashboard')
        }
      }
    }
    
    return NextResponse.next()
  }

  // ===== 2. OBTER E VERIFICAR TOKEN =====
  const token = request.cookies.get('auth_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    logAccess(request, null, 'ACCESS_DENIED_NO_TOKEN', false)
    return createRedirectResponse(request, '/login')
  }

  const user = await verifyToken(token)
  if (!user) {
    logAccess(request, null, 'ACCESS_DENIED_INVALID_TOKEN', false)
    return createRedirectResponse(request, '/login')
  }

  // ===== 3. VERIFICAR EXPIRAÃ‡ÃƒO DO TOKEN =====
  const now = Math.floor(Date.now() / 1000)
  if (user.exp < now) {
    logAccess(request, user, 'ACCESS_DENIED_EXPIRED_TOKEN', false)
    return createRedirectResponse(request, '/login')
  }

  // ===== 4. VERIFICAÃ‡Ã•ES DE ROLE E PERMISSÃ•ES =====
  
  // Verificar rotas administrativas
  if (isAdminRoute(pathname)) {
    if (user.role !== 'admin') {
      logAccess(request, user, 'ACCESS_DENIED_ADMIN_REQUIRED', false)
      return createRedirectResponse(request, '/dashboard')
    }
  }

  // Verificar rotas especÃ­ficas por role
  const requiredRole = requiresSpecificRole(pathname)
  if (requiredRole && user.role !== requiredRole) {
    // Verificar hierarquia de roles
    const roleHierarchy = { viewer: 1, seller: 2, manager: 3, admin: 4 }
    const userLevel = roleHierarchy[user.role] || 0
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0
    
    if (userLevel < requiredLevel) {
      logAccess(request, user, `ACCESS_DENIED_ROLE_${requiredRole.toUpperCase()}_REQUIRED`, false)
      return createRedirectResponse(request, '/dashboard')
    }
  }

  // ===== 5. VERIFICAÃ‡Ã•ES ESPECÃFICAS PARA API =====
  if (pathname.startsWith('/api/')) {
    // Verificar mÃ©todos HTTP restritos
    const restrictedMethods = ['POST', 'PUT', 'PATCH', 'DELETE']
    if (restrictedMethods.includes(method)) {
      const resource = pathname.split('/')[2] // /api/products -> products
      const action = method === 'POST' ? 'create' : 
                    method === 'DELETE' ? 'delete' : 'update'
      
      if (!hasPermission(user, resource, action)) {
        logAccess(request, user, `API_ACCESS_DENIED_${action.toUpperCase()}_${resource.toUpperCase()}`, false)
        return NextResponse.json(
          { 
            error: 'Forbidden',
            message: `VocÃª nÃ£o tem permissÃ£o para ${action} em ${resource}`,
            code: 'INSUFFICIENT_PERMISSIONS'
          },
          { status: 403 }
        )
      }
    }

    // Rate limiting bÃ¡sico para APIs
    const rateLimitKey = `${user.userId}:${pathname}`
    // Aqui vocÃª implementaria um sistema de rate limiting
    // usando Redis ou similar em produÃ§Ã£o
  }

  // ===== 6. ADICIONAR HEADERS DE USUÃRIO =====
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', user.userId)
  requestHeaders.set('x-user-email', user.email)
  requestHeaders.set('x-user-role', user.role)
  requestHeaders.set('x-user-permissions', JSON.stringify(user.permissions))

  // ===== 7. VERIFICAÃ‡Ã•ES DE SEGURANÃ‡A ADICIONAIS =====
  
  // Verificar se o usuÃ¡rio ainda estÃ¡ ativo (opcional - requer consulta ao DB)
  // if (pathname.startsWith('/api/') && shouldCheckUserStatus()) {
  //   const userActive = await checkUserActiveStatus(user.userId)
  //   if (!userActive) {
  //     return NextResponse.json({ error: 'User account deactivated' }, { status: 403 })
  //   }
  // }

  // Verificar IP whitelist para rotas sensÃ­veis (opcional)
  if (isAdminRoute(pathname)) {
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const allowedIPs = process.env.ADMIN_ALLOWED_IPS?.split(',') || []
    
    if (allowedIPs.length > 0 && !allowedIPs.includes(clientIP)) {
      logAccess(request, user, 'ACCESS_DENIED_IP_NOT_WHITELISTED', false)
      return NextResponse.json(
        { 
          error: 'Forbidden',
          message: 'Access denied from this IP address',
          code: 'IP_NOT_ALLOWED'
        },
        { status: 403 }
      )
    }
  }

  // ===== 8. ADICIONAR HEADERS DE RESPOSTA =====
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Headers de seguranÃ§a
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // CORS para APIs (ajustar conforme necessÃ¡rio)
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  // Atualizar Ãºltima atividade do usuÃ¡rio (opcional)
  response.cookies.set('last_activity', now.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  })

  logAccess(request, user, 'ACCESS_GRANTED', true)
  return response
}

// ===== CONFIGURAÃ‡ÃƒO DO MATCHER =====
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|.*\\..*|manifest\\.json|sw\\.js).*)',
  ],
}

// ===== FUNÃ‡Ã•ES AUXILIARES PARA EXTENSÃƒO =====

/**
 * Verificar se deve consultar status do usuÃ¡rio no banco
 * (implementar conforme necessidade)
 */
function shouldCheckUserStatus(): boolean {
  return process.env.ENABLE_USER_STATUS_CHECK === 'true'
}

/**
 * Consultar status ativo do usuÃ¡rio no banco de dados
 * (implementar com seu ORM/database)
 */
async function checkUserActiveStatus(userId: string): Promise<boolean> {
  // Exemplo de implementaÃ§Ã£o:
  // const user = await prisma.user.findUnique({
  //   where: { id: userId },
  //   select: { isActive: true }
  // })
  // return user?.isActive || false
  
  return true // Placeholder
}

/**
 * Sistema de rate limiting
 * (implementar com Redis ou similar em produÃ§Ã£o)
 */
class RateLimiter {
  private static requests = new Map<string, { count: number; resetTime: number }>()

  static check(key: string, limit: number = 100, windowMs: number = 60000): boolean {
    const now = Date.now()
    const record = this.requests.get(key)

    if (!record || now > record.resetTime) {
      this.requests.set(key, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (record.count >= limit) {
      return false
    }

    record.count++
    return true
  }
}

// ===== EXPORTAR UTILITÃRIOS PARA USO EM OUTROS LUGARES =====
export { 
  verifyToken, 
  hasPermission, 
  isPublicRoute, 
  isProtectedRoute, 
  isAdminRoute,
  RateLimiter
}

