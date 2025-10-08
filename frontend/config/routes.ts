import { Role, Permission } from '@/types/auth'

export interface RouteConfig {
  path: string
  requireAuth: boolean
  allowedRoles: Role[]
  requiredPermissions?: Permission[]
  rateLimit?: {
    requests: number
    windowMs: number
  }
  description?: string
}

export const ROUTES: RouteConfig[] = [
  {
    path: '/dashboard',
    requireAuth: true,
    allowedRoles: ['VIEWER', 'SELLER', 'MANAGER', 'ADMIN'],
    description: 'Ãrea principal do usuÃ¡rio'
  },
  {
    path: '/admin',
    requireAuth: true,
    allowedRoles: ['ADMIN'],
    description: 'Ãrea restrita de administraÃ§Ã£o'
  }
]

// Exemplo de rota customizada
export const CUSTOM_ROUTES: RouteConfig[] = [
  {
    path: '/minha-rota-especial',
    requireAuth: true,
    allowedRoles: ['MANAGER', 'ADMIN'],
    requiredPermissions: [
      { name: 'custom-read', resource: 'custom', action: 'read' }
    ],
    rateLimit: {
      requests: 100,
      windowMs: 60000 // 1 minuto
    },
    description: 'Rota personalizada'
  }
]



