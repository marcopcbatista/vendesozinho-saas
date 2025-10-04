import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useCallback, useEffect } from 'react'

// ===== TIPOS E INTERFACES =====
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'seller' | 'viewer'
  avatar?: string
  phone?: string
  department?: string
  permissions: Permission[]
  settings: UserSettings
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  isActive: boolean
}

export interface Permission {
  id: string
  name: string
  description: string
  resource: string // 'products', 'orders', 'customers', etc.
  actions: string[] // ['create', 'read', 'update', 'delete']
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto'
  language: 'pt-BR' | 'en-US' | 'es-ES'
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    orderUpdates: boolean
    lowStock: boolean
    dailyReports: boolean
  }
  dashboard: {
    defaultView: 'overview' | 'sales' | 'products' | 'customers'
    chartType: 'bar' | 'line' | 'pie'
    dateRange: '7d' | '30d' | '90d' | '1y'
  }
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  passwordConfirmation: string
  phone?: string
  department?: string
  acceptTerms: boolean
}

export interface ResetPasswordData {
  email: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  newPasswordConfirmation: string
}

export interface UpdateProfileData {
  name?: string
  phone?: string
  department?: string
  avatar?: File | string
  settings?: Partial<UserSettings>
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
  expiresAt: string
}

export interface AuthError {
  message: string
  code: string
  field?: string
}

// ===== CONSTANTES =====
const AUTH_STORAGE_KEY = 'vendesozinho_auth'
const REFRESH_TOKEN_KEY = 'vendesozinho_refresh'
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000 // 5 minutos antes da expiração

// ===== FUNÇÕES UTILITÁRIAS =====
const getStoredAuth = (): { token: string; refreshToken: string; expiresAt: string } | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

const setStoredAuth = (authData: { token: string; refreshToken: string; expiresAt: string }) => {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))
}

const clearStoredAuth = () => {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem(AUTH_STORAGE_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

const isTokenExpired = (expiresAt: string): boolean => {
  return new Date(expiresAt).getTime() - Date.now() < TOKEN_REFRESH_THRESHOLD
}

// ===== API FUNCTIONS =====
const authApi = {
  // Fazer login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error: AuthError = await response.json()
      throw new Error(error.message || 'Erro ao fazer login')
    }

    return response.json()
  },

  // Registrar usuário
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error: AuthError = await response.json()
      throw new Error(error.message || 'Erro ao criar conta')
    }

    return response.json()
  },

  // Buscar dados do usuário atual
  me: async (): Promise<User> => {
    const authData = getStoredAuth()
    if (!authData) throw new Error('Não autenticado')

    const response = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${authData.token}` },
    })

    if (!response.ok) {
      if (response.status === 401) {
        clearStoredAuth()
        throw new Error('Sessão expirada')
      }
      throw new Error('Erro ao buscar dados do usuário')
    }

    return response.json()
  },

  // Refresh token
  refreshToken: async (): Promise<AuthResponse> => {
    const authData = getStoredAuth()
    if (!authData?.refreshToken) throw new Error('Token de refresh não encontrado')

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authData.refreshToken}`,
      },
    })

    if (!response.ok) {
      clearStoredAuth()
      throw new Error('Erro ao renovar sessão')
    }

    return response.json()
  },

  // Logout
  logout: async (): Promise<void> => {
    const authData = getStoredAuth()
    
    if (authData?.token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${authData.token}` },
        })
      } catch {
        // Ignorar erros no logout
      }
    }

    clearStoredAuth()
  },

  // Reset de senha
  resetPassword: async (data: ResetPasswordData): Promise<void> => {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error: AuthError = await response.json()
      throw new Error(error.message || 'Erro ao enviar email de recuperação')
    }
  },

  // Alterar senha
  changePassword: async (data: ChangePasswordData): Promise<void> => {
    const authData = getStoredAuth()
    if (!authData) throw new Error('Não autenticado')

    const response = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authData.token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error: AuthError = await response.json()
      throw new Error(error.message || 'Erro ao alterar senha')
    }
  },

  // Atualizar perfil
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const authData = getStoredAuth()
    if (!authData) throw new Error('Não autenticado')

    const formData = new FormData()
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'avatar' && value instanceof File) {
          formData.append('avatar', value)
        } else if (key === 'settings') {
          formData.append('settings', JSON.stringify(value))
        } else {
          formData.append(key, String(value))
        }
      }
    })

    const response = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${authData.token}` },
      body: formData,
    })

    if (!response.ok) {
      const error: AuthError = await response.json()
      throw new Error(error.message || 'Erro ao atualizar perfil')
    }

    return response.json()
  },
}

// ===== HOOK PRINCIPAL =====
export const useAuth = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  // Query para buscar dados do usuário
  const {
    data: user,
    isLoading,
    error,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: authApi.me,
    retry: false,
    enabled: !!getStoredAuth()?.token,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  })

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setStoredAuth({
        token: data.token,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
      })
      
      queryClient.setQueryData(['auth', 'user'], data.user)
      toast.success(`Bem-vindo(a), ${data.user.name}!`)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  // Mutation para registro
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setStoredAuth({
        token: data.token,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
      })
      
      queryClient.setQueryData(['auth', 'user'], data.user)
      toast.success('Conta criada com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear()
      toast.success('Logout realizado com sucesso!')
      router.push('/login')
    },
    onError: (error: Error) => {
      console.error('Erro no logout:', error)
      // Mesmo com erro, limpar dados locais
      queryClient.clear()
      router.push('/login')
    },
  })

  // Mutation para reset de senha
  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('Email de recuperação enviado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  // Mutation para alterar senha
  const changePasswordMutation = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success('Senha alterada com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  // Mutation para atualizar perfil
  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['auth', 'user'], updatedUser)
      toast.success('Perfil atualizado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  // Função para refresh automático do token
  const refreshTokenIfNeeded = useCallback(async () => {
    const authData = getStoredAuth()
    if (!authData || !isTokenExpired(authData.expiresAt)) return

    try {
      const newAuthData = await authApi.refreshToken()
      setStoredAuth({
        token: newAuthData.token,
        refreshToken: newAuthData.refreshToken,
        expiresAt: newAuthData.expiresAt,
      })
      
      // Refetch user data com novo token
      refetchUser()
    } catch (error) {
      console.error('Erro ao renovar token:', error)
      logoutMutation.mutate()
    }
  }, [refetchUser, logoutMutation])

  // Verificar token periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      refreshTokenIfNeeded()
    }, 60 * 1000) // Verificar a cada minuto

    return () => clearInterval(interval)
  }, [refreshTokenIfNeeded])

  // Funções de conveniência para verificação de permissões
  const hasPermission = useCallback((resource: string, action: string): boolean => {
    if (!user?.permissions) return false
    
    return user.permissions.some(permission => 
      permission.resource === resource && 
      permission.actions.includes(action)
    )
  }, [user?.permissions])

  const hasRole = useCallback((role: User['role']): boolean => {
    return user?.role === role
  }, [user?.role])

  const hasAnyRole = useCallback((roles: User['role'][]): boolean => {
    return user ? roles.includes(user.role) : false
  }, [user?.role])

  const isAdmin = useCallback((): boolean => {
    return user?.role === 'admin'
  }, [user?.role])

  const canAccess = useCallback((resource: string, action: string = 'read'): boolean => {
    return isAdmin() || hasPermission(resource, action)
  }, [isAdmin, hasPermission])

  // Função para login com redirecionamento
  const login = useCallback(async (credentials: LoginCredentials, redirectTo?: string) => {
    await loginMutation.mutateAsync(credentials)
    
    // Redirecionamento após login bem-sucedido
    const redirect = redirectTo || '/dashboard'
    router.push(redirect)
  }, [loginMutation, router])

  // Função para registro com redirecionamento  
  const register = useCallback(async (data: RegisterData, redirectTo?: string) => {
    await registerMutation.mutateAsync(data)
    
    // Redirecionamento após registro bem-sucedido
    const redirect = redirectTo || '/dashboard'
    router.push(redirect)
  }, [registerMutation, router])

  return {
    // Estado
    user,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
    isAuthenticated: !!user,
    error,

    // Ações
    login,
    register,
    logout: logoutMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    refetchUser,

    // Estados das mutations
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,

    // Verificações de permissão
    hasPermission,
    hasRole,
    hasAnyRole,
    isAdmin,
    canAccess,

    // Utilitários
    refreshToken: refreshTokenIfNeeded,
  }
}

// ===== HOOKS AUXILIARES =====

// Hook para proteger rotas
export const useRequireAuth = (redirectTo: string = '/login') => {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, redirectTo, router])

  return { isAuthenticated, isLoading }
}

// Hook para verificar permissões específicas
export const usePermission = (resource: string, action: string = 'read') => {
  const { canAccess, isLoading } = useAuth()
  
  return {
    hasAccess: canAccess(resource, action),
    isLoading,
  }
}

// Hook para dados do usuário com fallback
export const useUser = () => {
  const { user, isLoading, error, refetchUser } = useAuth()
  
  return {
    user,
    isLoading,
    error,
    refetch: refetchUser,
    displayName: user?.name || 'Usuário',
    initials: user?.name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U',
  }
}
