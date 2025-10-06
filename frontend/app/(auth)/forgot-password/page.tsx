'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle, Shield } from 'lucide-react'

interface ForgotPasswordFormData {
  email: string
}

interface FormErrors {
  email?: string
  general?: string
}

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email Ã© obrigatÃ³rio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invÃ¡lido'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    setErrors({})
    
    try {
      await resetPassword({ email: formData.email.toLowerCase().trim() })
      setEmailSent(true)
    } catch (error: any) {
      if (error.message?.includes('User not found')) {
        setErrors({ email: 'Nenhuma conta encontrada com este email' })
      } else if (error.message?.includes('Too many requests')) {
        setErrors({ general: 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.' })
      } else if (error.message?.includes('Network')) {
        setErrors({ general: 'Erro de conexÃ£o. Verifique sua internet e tente novamente.' })
      } else {
        setErrors({ general: error.message || 'Erro interno. Tente novamente.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleInputChange = (field: keyof ForgotPasswordFormData, value: string) => {
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
  
  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Email enviado!
            </h2>
            <p className="text-gray-600">
              Verifique sua caixa de entrada e siga as instruÃ§Ãµes para redefinir sua senha.
            </p>
          </div>
          
          <div className="space-y-4 text-sm text-gray-600 mb-6">
            <p>
              ðŸ“§ Enviamos um link de recuperaÃ§Ã£o para:{' '}
              <span className="font-medium text-gray-900">{formData.email}</span>
            </p>
            <p>
              â° O link expira em <strong>1 hora</strong>
            </p>
            <p>
              ðŸ“‚ NÃ£o encontrou? Verifique sua pasta de spam
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                setEmailSent(false)
                setFormData({ email: '' })
              }}
              className="w-full py-2 px-4 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-600 hover:border-blue-800 rounded-lg transition-colors"
            >
              Enviar para outro email
            </button>
            
            <Link
              href="/login"
              className="block w-full py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <div className="flex min-h-screen">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-cyan-600 p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col justify-center max-w-md">
            <div className="mb-8">
              <Shield className="w-16 h-16 mb-6" />
              <h1 className="text-4xl font-bold mb-4">
                Esqueceu sua senha?
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed">
                NÃ£o se preocupe! Isso acontece com todo mundo. 
                Vamos ajudÃ¡-lo a recuperar o acesso Ã  sua conta de forma segura.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Processo 100% seguro</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Link com expiraÃ§Ã£o automÃ¡tica</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Sem alteraÃ§Ã£o nÃ£o autorizada</span>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-white/10 rounded-lg">
              <p className="text-sm text-blue-100">
                ðŸ’¡ <strong>Dica:</strong> Para maior seguranÃ§a, defina uma senha forte 
                com letras, nÃºmeros e sÃ­mbolos quando recuperar o acesso.
              </p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-10 right-20 w-32 h-32 bg-white/5 rounded-full"></div>
        </div>
        
        {/* Right Panel - Forgot Password Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Back Button */}
            <div className="mb-6">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para login
              </Link>
            </div>
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="lg:hidden mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Recuperar Senha
              </h2>
              <p className="text-gray-600">
                Digite seu email e enviaremos um link para redefinir sua senha
              </p>
            </div>
            
            {/* General Error Message */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{errors.general}</p>
              </div>
            )}
            
            {/* Forgot Password Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email da sua conta
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
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.email 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
                    }`}
                    placeholder="seu@email.com"
                    disabled={isSubmitting}
                    autoComplete="email"
                    autoFocus
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Certifique-se de usar o mesmo email cadastrado na sua conta
                </p>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Enviando email...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar link de recuperaÃ§Ã£o
                  </>
                )}
              </button>
            </form>
            
            {/* Help Text */}
            <div className="mt-8 text-center">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Precisa de ajuda?
                </h4>
                <p className="text-sm text-gray-600">
                  Se vocÃª nÃ£o conseguir recuperar sua senha ou nÃ£o receber o email, 
                  entre em contato com nosso suporte.
                </p>
                <Link
                  href="/support"
                  className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Contatar Suporte â†’
                </Link>
              </div>
            </div>
            
            {/* Security Notice */}
            <div className="mt-6 text-center text-xs text-gray-500">
              <p>ðŸ”’ Link vÃ¡lido por apenas 1 hora por motivos de seguranÃ§a</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

