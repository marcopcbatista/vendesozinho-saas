// ========================================
// 🔹 User, Roles, Permissions e Tipos de Autenticação
// ========================================

// ===== Enum com as roles disponíveis =====
export type Role = 'ADMIN' | 'MANAGER' | 'SELLER' | 'VIEWER'

// ===== Interface de Permissões =====
export interface Permission {
  name: string
  description?: string
  resource?: string
  action?: string
}

// ===== Interface principal de Usuário =====
export interface User {
  id: string
  name: string
  email: string
  password: string       // ✅ Agora é opcional
  hashedPassword: string
  role: Role
  department?: string
  avatar?: string
  createdAt: string
  updatedAt: string
  isActive?: boolean
  emailVerified?: boolean
  registrationIp?: string
  registrationUserAgent?: string
  permissions?: Permission[]
}

// ===== Dados de Registro =====
export interface RegisterData {
  name: string
  email: string
  password: string;passwordConfirmation: string
  phone?: string | null
  acceptTerms: boolean
}

// ===== Dados de Login =====
export interface LoginCredentials {
  email: string
  password: string;rememberMe?: boolean
}

// ===== Dados de Redefinição de Senha =====
export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  newPasswordConfirmation: string
}

// ===== Dados de Resposta da API =====
export interface AuthResponse {
  success: boolean
  message?: string
  user?: User
  accessToken?: string
  refreshToken?: string
}

// ===== Utilitários de Validação =====
export const ValidationUtils = {
  validateEmail: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),

  validatePassword: (password: string) => {
    const errors: string[] = []
    if (password.length < 6) errors.push('A senha deve ter pelo menos 6 caracteres')
    if (!/[A-Z]/.test(password)) errors.push('A senha deve conter pelo menos uma letra maiúscula')
    if (!/[0-9]/.test(password)) errors.push('A senha deve conter pelo menos um número')
    return { isValid: errors.length === 0, errors }
  },

  validatePhone: (phone: string) => /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(phone),

  formatPhone: (phone: string) => {
    const digits = phone.replace(/\D/g, '')
    if (digits.length <= 2) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
  }
}

// ===== Utilitários de Permissão =====
export const PermissionUtils = {
  hasPermission: (permissions: Permission[] = [], name: string) =>
    permissions.some((p) => p.name === name || p.action === name),

  hasRole: (user: { role?: Role }, role: Role) =>
    user.role?.toUpperCase() === role.toUpperCase(),

  hasHigherRole: (user: { role?: Role }, requiredRole: Role) => {
    if (!user || !user.role) return false
    const hierarchy: Role[] = ['VIEWER', 'SELLER', 'MANAGER', 'ADMIN']
    const userIndex = hierarchy.indexOf(user.role)
    const requiredIndex = hierarchy.indexOf(requiredRole)
    return userIndex >= requiredIndex
  }
}






