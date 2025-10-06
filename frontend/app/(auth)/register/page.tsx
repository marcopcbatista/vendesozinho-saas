'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading } = useAuth()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirmation: '',
    acceptTerms: false
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      await register(formData)
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta')
    }
  }

  return (
    <div className=\"min-h-screen flex items-center justify-center bg-gray-50 p-4\">
      <div className=\"max-w-md w-full bg-white rounded-lg shadow-lg p-8\">
        <h1 className=\"text-2xl font-bold mb-6\">Criar Conta</h1>
        
        {error && (
          <div className=\"mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm\">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className=\"space-y-4\">
          <div>
            <label className=\"block text-sm font-medium mb-1\">Nome</label>
            <input
              type=\"text\"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className=\"w-full border rounded px-3 py-2\"
              required
            />
          </div>
          
          <div>
            <label className=\"block text-sm font-medium mb-1\">Email</label>
            <input
              type=\"email\"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className=\"w-full border rounded px-3 py-2\"
              required
            />
          </div>
          
          <div>
            <label className=\"block text-sm font-medium mb-1\">Senha</label>
            <div className=\"relative\">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className=\"w-full border rounded px-3 py-2 pr-10\"
                required
              />
              <button
                type=\"button\"
                onClick={() => setShowPassword(!showPassword)}
                className=\"absolute right-2 top-1/2 -translate-y-1/2\"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <div>
            <label className=\"block text-sm font-medium mb-1\">Confirmar Senha</label>
            <input
              type=\"password\"
              value={formData.passwordConfirmation}
              onChange={e => setFormData({...formData, passwordConfirmation: e.target.value})}
              className=\"w-full border rounded px-3 py-2\"
              required
            />
          </div>
          
          <label className=\"flex items-center space-x-2\">
            <input
              type=\"checkbox\"
              checked={formData.acceptTerms}
              onChange={e => setFormData({...formData, acceptTerms: e.target.checked})}
              required
            />
            <span className=\"text-sm\">Aceito os termos e condições</span>
          </label>
          
          <button
            type=\"submit\"
            disabled={isLoading}
            className=\"w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50\"
          >
            {isLoading ? 'Criando...' : 'Criar Conta'}
          </button>
        </form>
      </div>
    </div>
  )
}
