'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

interface RegisterData {
  name: string
  email: string
  phone?: string
  password: string
  passwordConfirmation: string
  acceptTerms: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar se há usuário salvo
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // TODO: Implementar login real com API
    setIsLoading(true)
    try {
      // Simulação
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockUser = { id: '1', name: 'Usuário Teste', email }
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    // TODO: Implementar registro real com API
    setIsLoading(true)
    try {
      // Validações
      if (data.password !== data.passwordConfirmation) {
        throw new Error('Senhas não coincidem')
      }
      if (!data.acceptTerms) {
        throw new Error('Você deve aceitar os termos')
      }

      // Simulação
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockUser = { id: '1', name: data.name, email: data.email }
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
