'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { 
  Eye, EyeOff, Lock, Mail, User, Phone, AlertCircle, 
  CheckCircle, Loader2, Shield, ArrowRight, Check, X 
} from 'lucide-react'

interface RegisterFormData {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
  acceptTerms?: string
  general?: string
}

interface PasswordStrength {
  score: number
  feedback: string[]
  color: string
}

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading, isAuthenticated } = useAuth()
  
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    color: 'bg-gray-200'
  })
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, router])
  
  // Password strength calculation
  useEffect(() => {
    const calculatePasswordStrength = (password: string): PasswordStrength => {
      if (!password) {
        return { score: 0, feedback: [], color: 'bg-gray-200' }
      }
      
      let score = 0
      const feedback: string[] = []
      
      // Length check
      if (password.length >= 8) {
        score += 1
      } else {
        feedback.push('Mínimo 8 caracteres')
      }
      
      // Lowercase check
      if (/[a-z]/.test(password)) {
        score += 1
      } else {
        feedback.push('Letra minúscula')
      }
      
      // Uppercase check
      if (/[A-Z]/.test(password)) {
        score += 1
      } else {
        feedback.push('Letra maiúscula')
      }
      
      // Number check
      if (/\d/.test(password)) {
        score += 1
      } else {
        feedback.push('Número')
      }
      
      // Special character check
      if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        score += 1
      } else {
        feedback.push('Caractere especial (!@#$%^&*)')
      }
      
      // Determine color based on score
      let color = 'bg-red-500'
      if (score >= 4) color = 'bg-green-500'
      else if (score >= 3) color = 'bg-yellow-500'
      else if (score >= 1) color = 'bg-orange-500'
      
      return { score, feedback, color }
    }
    
    setPasswordStrength(calculatePasswordStrength(formData.password))
  }, [formData.password])
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres'
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    
    // Phone validation (optional but if filled must be valid)
    if (formData.phone && !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone inválido. Use o formato (11) 99999-9999'
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (passwordStrength.score < 3) {
      newErrors.password = 'Senha muito fraca. Precisa ser mais forte.'
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem'
    }
    
    // Terms validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Você deve aceitar os termos e condições'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    
    // Format as (XX) XXXXX-XXXX or (XX) XXXX-XXXX
    if (digits.length <= 10) {
      return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    } else {
      return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    setErrors({})
    
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone || undefined,
        password: formData.password
      })
      
      setShowSuccess(true)
      
      // Redirect after successful registration
      setTimeout(() => {
        router.replace('/dashboard')
      }, 2000)
      
    } catch (error: any) {
      // Handle different error types
      if (error.message?.includes('Email already exists')) {
        setErrors({ email: 'Este email já está cadastrado' })
      } else if (error.message?.includes('Phone already exists')) {
        setErrors({ phone: 'Este telefone já está cadastrado' })
      } else if (error.message?.includes('Network')) {
        setErrors({ general: 'Erro de conexão. Verifique sua internet e tente novamente.' })
      } else {
        setErrors({ general: error.message || 'Erro interno. Tente novamente.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleInputChange = (field: keyof RegisterFormData, value: string | boolean) => {
    // Special formatting for phone
    if (field === 'phone' && typeof value === 'string') {
      value = formatPhoneNumber(value)
    }
    
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    
    // Clear general error when user makes changes
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }))
    }
  }
  
  // Show loading state for already authenticated users
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Redirecionando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <div className="flex min-h-screen">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-800 p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col justify-center max-w-md">
            <div className="mb-8">
              <Shield className="w-16 h-16 mb-6" />
              <h1 className="text-4xl font-bold mb-4">
                Junte-se a nós!
              </h1>
              <p className="text-indigo-100 text-lg leading-relaxed">
                Crie sua conta e tenha acesso completo ao sistema. 
                Rápido, seguro e com suporte completo.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Cadastro rápido e seguro</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Acesso imediato após registro</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Suporte técnico completo</span>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-10 right-20 w-32 h-32 bg-white/5 rounded-full"></div>
          <div className="absolute top-1/2 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
        </div>
        
        {/* Right Panel - Register Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="lg:hidden mb-6">
                <Shield className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Criar Conta
              </h2>
              <p className="text-gray-600">
                Preencha os dados abaixo para criar sua conta
              </p>
            </div>
            
            {/* Success Message */}
            {showSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-green-800 font-medium">Conta criada com sucesso!</p>
                  <p className="text-green-600 text-sm">Redirecionando para o dashboard...</p>
                </div>
              </div>
            )}
            
            {/* General Error Message */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{errors.general}</p>
              </div>
            )}
            
            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome completo *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                      errors.name 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 hover:border-gray-400 focus:border-indigo-500'
                    }`}
                    placeholder="Seu nome completo"
                    disabled={isSubmitting}
                    autoComplete="name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                      errors.email 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 hover:border-gray-400 focus:border-indigo-500'
                    }`}
                    placeholder="seu@email.com"
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone (opcional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                      errors.phone 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 hover:border-gray-400 focus:border-indigo-500'
                    }`}
                    placeholder="(11) 99999-9999"
                    disabled={isSubmitting}
                    autoComplete="tel"
                    maxLength={15}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
              
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                      errors.password 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 hover:border-gray-400 focus:border-indigo-500'
                    }`}
                    placeholder="Crie uma senha forte"
                    disabled={isSubmitting}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {passwordStrength.score === 0 && 'Muito fraca'}
                        {passwordStrength.score === 1 && 'Fraca'}
                        {passwordStrength.score === 2 && 'Fraca'}
                        {passwordStrength.score === 3 && 'Razoável'}
                        {passwordStrength.score === 4 && 'Forte'}
                        {passwordStrength.score === 5 && 'Muito forte'}
                      </span>
                    </div>
                    
                    {passwordStrength.feedback.length > 0 && (
                      <div className="text-xs text-gray-600">
                        <p className="mb-1">Sua senha precisa de:</p>
                        <div className="space-y-1">
                          {passwordStrength.feedback.map((item, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <X className="w-3 h-3 text-red-500" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {passwordStrength.score >= 3 && (
                      <div className="text-xs text-green-600 flex items-center space-x-2 mt-1">
                        <Check className="w-3 h-3" />
                        <span>Senha adequada!</span>
                      </div>
                    )}
                  </div>
                )}
                
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              
              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar senha *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                      errors.confirmPassword 
                        ? 'border-red-300 bg-red-50' 
                        : formData.confirmPassword && formData.password === formData.confirmPassword
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400 focus:border-indigo-500'
                    }`}
                    placeholder="Confirme sua senha"
                    disabled={isSubmitting}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-1 flex items-center space-x-2 text-xs">
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <Check className="w-3 h-3 text-green-500" />
                        <span className="text-green-600">Senhas coincidem</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3 text-red-500" />
                        <span className="text-red-600">Senhas não coincidem</span>
                      </>
                    )}
                  </div>
                )}
                
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
              
              {/* Terms and Conditions */}
              <div>
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                    className={`mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded ${
                      errors.acceptTerms ? 'border-red-300' : ''
                    }`}
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-gray-600">
                    Eu aceito os{' '}
                    <Link 
                      href="/terms" 
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                      target="_blank"
                    >
                      Termos de Uso
                    </Link>
                    {' '}e{' '}
                    <Link 
                      href="/privacy" 
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                      target="_blank"
                    >
                      Política de Privacidade
                    </Link>
                    *
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>
                )}
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || showSuccess || passwordStrength.score < 3}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Criando conta...
                  </>
                ) : showSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Conta criada!
                  </>
                ) : (
                  <>
                    Criar conta
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </form>
            
            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Já tem uma conta?{' '}
                <Link 
                  href="/login" 
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Faça login
                </Link>
              </p>
            </div>
            
            {/* Security Notice */}
            <div className="mt-6 text-center text-xs text-gray-500">
              <p>🔒 Seus dados são protegidos com criptografia SSL</p>
              <p className="mt-1">* Campos obrigatórios</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
