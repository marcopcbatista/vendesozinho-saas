// ===== TIPOS DE AUTENTICAÇÃO =====

// Roles do sistema com hierarquia
export type UserRole = 'admin' | 'manager' | 'seller' | 'viewer'

// Mapeamento de hierarquia de roles
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  viewer: 1,
  seller: 2,
  manager: 3,
  admin: 4,
}

// Recursos do sistema
export type SystemResource = 
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'orders'
  | 'customers'
  | 'users'
  | 'reports'
  | 'settings'
  | 'analytics'
  | 'inventory'
  | 'promotions'
  | 'integrations'

// Ações disponíveis por recurso
export type ResourceAction = 'create' | 'read' | 'update' | 'delete' | 'export' | 'import'

// Permissões padrão por role
export const DEFAULT_PERMISSIONS: Record<UserRole, Array<{resource: SystemResource, actions: ResourceAction[]}>> = {
  viewer: [
    { resource: 'dashboard', actions: ['read'] },
    { resource: 'products', actions: ['read'] },
    { resource: 'orders', actions: ['read'] },
    { resource: 'customers', actions: ['read'] },
    { resource: 'reports', actions: ['read'] },
  ],
  seller: [
    { resource: 'dashboard', actions: ['read'] },
    { resource: 'products', actions: ['read', 'update'] },
    { resource: 'orders', actions: ['create', 'read', 'update'] },
    { resource: 'customers', actions: ['create', 'read', 'update'] },
    { resource: 'reports', actions: ['read'] },
    { resource: 'inventory', actions: ['read', 'update'] },
  ],
  manager: [
    { resource: 'dashboard', actions: ['read'] },
    { resource: 'products', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'categories', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'orders', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'customers', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'users', actions: ['read', 'update'] },
    { resource: 'reports', actions: ['read', 'export'] },
    { resource: 'analytics', actions: ['read'] },
    { resource: 'inventory', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'promotions', actions: ['create', 'read', 'update', 'delete'] },
  ],
  admin: [
    { resource: 'dashboard', actions: ['read'] },
    { resource: 'products', actions: ['create', 'read', 'update', 'delete', 'import', 'export'] },
    { resource: 'categories', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'orders', actions: ['create', 'read', 'update', 'delete', 'export'] },
    { resource: 'customers', actions: ['create', 'read', 'update', 'delete', 'import', 'export'] },
    { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'reports', actions: ['read', 'export'] },
    { resource: 'settings', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'analytics', actions: ['read', 'export'] },
    { resource: 'inventory', actions: ['create', 'read', 'update', 'delete', 'import', 'export'] },
    { resource: 'promotions', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'integrations', actions: ['create', 'read', 'update', 'delete'] },
  ],
}

// Status de conta
export type AccountStatus = 'active' | 'inactive' | 'suspended' | 'pending'

// Preferências de notificação
export interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  orderUpdates: boolean
  lowStock: boolean
  dailyReports: boolean
  weeklyReports: boolean
  monthlyReports: boolean
  systemMaintenance: boolean
  securityAlerts: boolean
}

// Configurações do dashboard
export interface DashboardSettings {
  defaultView: 'overview' | 'sales' | 'products' | 'customers' | 'analytics'
  chartType: 'bar' | 'line' | 'pie' | 'area'
  dateRange: '7d' | '30d' | '90d' | '1y' | 'custom'
  showWelcomeMessage: boolean
  compactMode: boolean
  autoRefresh: boolean
  refreshInterval: 30 | 60 | 300 | 600 // segundos
}

// Configurações de aparência
export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto'
  colorScheme: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  fontSize: 'small' | 'medium' | 'large'
  language: 'pt-BR' | 'en-US' | 'es-ES'
  timezone: string
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
  timeFormat: '12h' | '24h'
  currency: 'BRL' | 'USD' | 'EUR'
}

// Configurações de segurança
export interface SecuritySettings {
  twoFactorEnabled: boolean
  sessionTimeout: 15 | 30 | 60 | 120 // minutos
  loginNotifications: boolean
  passwordExpiryDays: 30 | 60 | 90 | 180 | 0 // 0 = nunca expira
  allowMultipleSessions: boolean
  ipWhitelist: string[]
}

// Configurações completas do usuário
export interface UserSettings {
  notifications: NotificationPreferences
  dashboard: DashboardSettings
  appearance: AppearanceSettings
  security: SecuritySettings
}

// Dados de auditoria
export interface AuditData {
  createdAt: string
  updatedAt: string
  createdBy?: string
  updatedBy?: string
  version: number
  lastLoginAt?: string
  loginCount: number
  lastLoginIP?: string
  lastLoginUserAgent?: string
}

// Informações de perfil social
export interface SocialProfile {
  provider: 'google' | 'facebook' | 'linkedin' | 'microsoft'
  providerId: string
  avatar?: string
  connectedAt: string
}

// Token de sessão
export interface SessionToken {
  token: string
  refreshToken: string
  expiresAt: string
  issuedAt: string
  deviceInfo?: {
    userAgent: string
    ip: string
    location?: string
  }
}

// Histórico de login
export interface LoginHistory {
  id: string
  timestamp: string
  ip: string
  userAgent: string
  location?: string
  success: boolean
  failureReason?: string
}

// Configurações de API
export interface ApiConfiguration {
  baseURL: string
  timeout: number
  retryAttempts: number
  retryDelay: number
  enableRefreshToken: boolean
  tokenRefreshThreshold: number
}

// Contexto de autenticação estendido
export interface AuthContextExtended {
  // Dados básicos
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Sessão
  session: SessionToken | null
  sessionExpiry: Date | null
  
  // Histórico e auditoria
  loginHistory: LoginHistory[]
  lastActivity: Date | null
  
  // Configurações
  settings: UserSettings
  
  // Funcionalidades
  hasPermission: (resource: SystemResource, action: ResourceAction) => boolean
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
  isAdmin: () => boolean
  canAccess: (resource: SystemResource, action?: ResourceAction) => boolean
  
  // Ações
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  updateProfile: (data: UpdateProfileData) => Promise<void>
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>
  changePassword: (data: ChangePasswordData) => Promise<void>
}

// Eventos de autenticação
export type AuthEvent = 
  | 'login'
  | 'logout'
  | 'token-refresh'
  | 'profile-update'
  | 'password-change'
  | 'settings-update'
  | 'session-expire'

// Listener para eventos
export interface AuthEventListener {
  event: AuthEvent
  callback: (data?: any) => void
}

// Validação de formulários
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export interface FormValidation {
  [key: string]: ValidationRule
}

// Configurações de validação para auth
export const AUTH_VALIDATION: Record<string, FormValidation> = {
  login: {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      required: true,
      minLength: 6
    }
  },
  register: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
    },
    passwordConfirmation: {
      required: true,
      custom: (value: string, formData: any) => 
        value === formData.password || 'As senhas não coincidem'
    },
    phone: {
      pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/
    },
    acceptTerms: {
      required: true
    }
  },
  changePassword: {
    currentPassword: {
      required: true
    },
    newPassword: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
    },
    newPasswordConfirmation: {
      required: true,
      custom: (value: string, formData: any) => 
        value === formData.newPassword || 'As senhas não coincidem'
    }
  }
}

// Mensagens de erro padrão
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'invalid-credentials': 'Email ou senha incorretos',
  'user-not-found': 'Usuário não encontrado',
  'user-disabled': 'Conta desativada. Entre em contato com o suporte',
  'too-many-attempts': 'Muitas tentativas de login. Tente novamente mais tarde',
  'email-already-exists': 'Este email já está sendo usado',
  'weak-password': 'A senha deve ter pelo menos 8 caracteres com letras maiúsculas, minúsculas, números e símbolos',
  'invalid-token': 'Token inválido ou expirado',
  'session-expired': 'Sua sessão expirou. Faça login novamente',
  'network-error': 'Erro de conexão. Verifique sua internet',
  'server-error': 'Erro interno do servidor. Tente novamente mais tarde',
  'unauthorized': 'Você não tem permissão para executar esta ação',
  'forbidden': 'Acesso negado',
  'validation-error': 'Dados inválidos. Verifique os campos e tente novamente'
}

// Re-export dos tipos principais do hook
export type {
  User,
  Permission,
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
  ChangePasswordData,
  UpdateProfileData,
  AuthResponse,
  AuthError
} from '../hooks/use-auth'

// Utilitários para trabalhar com permissões
export class PermissionUtils {
  static hasRole(user: User | null, role: UserRole): boolean {
    return user?.role === role
  }

  static hasAnyRole(user: User | null, roles: UserRole[]): boolean {
    return user ? roles.includes(user.role) : false
  }

  static hasHigherRole(user: User | null, targetRole: UserRole): boolean {
    if (!user) return false
    return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[targetRole]
  }

  static hasPermission(user: User | null, resource: SystemResource, action: ResourceAction): boolean {
    if (!user?.permissions) return false
    
    return user.permissions.some(permission => 
      permission.resource === resource && 
      permission.actions.includes(action)
    )
  }

  static canAccess(user: User | null, resource: SystemResource, action: ResourceAction = 'read'): boolean {
    if (!user) return false
    
    // Admin tem acesso total
    if (user.role === 'admin') return true
    
    // Verificar permissões específicas
    return this.hasPermission(user, resource, action)
  }

  static getPermissionsForRole(role: UserRole): Array<{resource: SystemResource, actions: ResourceAction[]}> {
    return DEFAULT_PERMISSIONS[role] || []
  }

  static validateRoleHierarchy(currentUserRole: UserRole, targetUserRole: UserRole): boolean {
    return ROLE_HIERARCHY[currentUserRole] > ROLE_HIERARCHY[targetUserRole]
  }
}

// Utilitários para validação
export class ValidationUtils {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push('A senha deve ter pelo menos 8 caracteres')
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra minúscula')
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra maiúscula')
    }
    
    if (!/\d/.test(password)) {
      errors.push('A senha deve conter pelo menos um número')
    }
    
    if (!/[@$!%*?&]/.test(password)) {
      errors.push('A senha deve conter pelo menos um caractere especial (@$!%*?&)')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/
    return phoneRegex.test(phone)
  }

  static formatPhone(phone: string): string {
    const numbers = phone.replace(/\D/g, '')
    
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
    } else if (numbers.length === 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    }
    
    return phone
  }

  static sanitizeUserInput(input: string): string {
    return input.trim().replace(/[<>]/g, '')
  }
}

// Constantes de configuração
export const AUTH_CONFIG = {
  // Timeouts
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutos
  LOGIN_TIMEOUT: 10 * 1000, // 10 segundos
  
  // Tentativas
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutos
  
  // Validação
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MAX_NAME_LENGTH: 100,
  
  // URLs
  LOGIN_REDIRECT: '/dashboard',
  LOGOUT_REDIRECT: '/login',
  UNAUTHORIZED_REDIRECT: '/login',
  
  // Storage keys
  TOKEN_KEY: 'vendesozinho_auth',
  REFRESH_KEY: 'vendesozinho_refresh',
  USER_PREFERENCES: 'vendesozinho_preferences',
} as const

// Hooks auxiliares para componentes
export interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requiredRole?: UserRole
  requiredPermission?: {
    resource: SystemResource
    action: ResourceAction
  }
  redirectTo?: string
}

// Tipos para formulários de auth
export interface LoginFormData extends LoginCredentials {
  rememberMe: boolean
}

export interface RegisterFormData extends RegisterData {
  acceptTerms: boolean
  acceptMarketing?: boolean
}

export interface ResetPasswordFormData extends ResetPasswordData {}

export interface ChangePasswordFormData extends ChangePasswordData {}

// Estados de loading específicos
export interface AuthLoadingStates {
  login: boolean
  register: boolean
  logout: boolean
  resetPassword: boolean
  changePassword: boolean
  updateProfile: boolean
  refreshToken: boolean
}

// Métricas de autenticação (para analytics)
export interface AuthMetrics {
  totalUsers: number
  activeUsers: number
  loginAttempts: number
  successfulLogins: number
  failedLogins: number
  passwordResets: number
  sessionDuration: number
  mostActiveHours: number[]
  deviceBreakdown: Record<string, number>
  locationBreakdown: Record<string, number>
}
