import { toast } from 'sonner'
// ===== EXEMPLOS DE USO DO HOOK DE AUTENTICAÇÃO =====
import React, { useState } from 'react'
import { useAuth, useRequireAuth, usePermission, useUser } from '@/hooks/use-auth'
import { PermissionUtils, ValidationUtils } from '@/types/auth'
import type { LoginCredentials, RegisterData, ChangePasswordData } from '@/types/auth'

// ===== 1. COMPONENTE DE LOGIN =====
export const LoginExample: React.FC = () => {
  const { login, isLoggingIn } = useAuth()
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = 'Email é obrigatório'
    else if (!ValidationUtils.validateEmail(formData.email))
      newErrors.email = 'Email inválido'

    if (!formData.password) newErrors.password = 'Senha é obrigatória'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await login(formData, '/dashboard')
      setErrors({})
      toast.success('Login realizado com sucesso!')
    } catch (error) {
      console.error('Erro no login:', error)
      toast.error('Falha no login, tente novamente.')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className={`input ${errors.email ? 'input-error' : ''}`}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="seu@email.com"
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        <div>
          <label className="label">Senha</label>
          <input
            type="password"
            className={`input ${errors.password ? 'input-error' : ''}`}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
          />
          {errors.password && <p className="form-error">{errors.password}</p>}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={formData.rememberMe}
            onChange={(e) =>
              setFormData({ ...formData, rememberMe: e.target.checked })
            }
            className="mr-2"
          />
          <label htmlFor="rememberMe" className="text-sm">
            Lembrar de mim
          </label>
        </div>

        <button type="submit" disabled={isLoggingIn} className="btn btn-primary w-full">
          {isLoggingIn ? (
            <span className="flex items-center">
              <span className="spinner spinner-sm mr-2" />
              Entrando...
            </span>
          ) : (
            'Entrar'
          )}
        </button>
      </form>
    </div>
  )
}

// ===== 6. EXEMPLO DE USO DE PERMISSÕES =====
export const PermissionExample: React.FC = () => {
  const { hasAccess } = usePermission('products', 'create')
  const { user, canAccess } = useAuth()

  return (
    <div className="space-y-4">
      <h3>Exemplos de Verificação de Permissões</h3>

      <div className="space-y-2">
        <p>Pode criar produtos: {hasAccess ? '✅' : '❌'}</p>
        <p>Pode editar usuários: {canAccess('users', 'update') ? '✅' : '❌'}</p>
        <p>
          É administrador:{' '}
          {user && PermissionUtils.hasRole(user, 'admin') ? '✅' : '❌'}
        </p>
        <p>
          Tem role manager ou superior:{' '}
          {user && PermissionUtils.hasHigherRole(user, 'manager') ? '✅' : '❌'}
        </p>
      </div>

      {canAccess('products', 'create') && (
        <button className="btn btn-primary">Criar Produto</button>
      )}

      {canAccess('reports', 'export') && (
        <button className="btn btn-outline">Exportar Relatórios</button>
      )}
    </div>
  )
}

export default {
  LoginExample,
  PermissionExample,
}
