// ===== EXEMPLOS DE USO DO HOOK DE AUTENTICAÃ‡ÃƒO =====

import React, { useState } from 'react'
import { useAuth, useRequireAuth, usePermission, useUser } from '../hooks/use-auth'
import { PermissionUtils, ValidationUtils } from '../types/auth'
import type { LoginCredentials, RegisterData, ChangePasswordData } from '../types/auth'

// ===== 1. COMPONENTE DE LOGIN =====
export const LoginExample: React.FC = () => {
  const { login, isLoggingIn } = useAuth()
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // ValidaÃ§Ã£o bÃ¡sica
    const newErrors: Record<string, string> = {}
    
    if (!formData.email) {
      newErrors.email = 'Email Ã© obrigatÃ³rio'
    } else if (!ValidationUtils.validateEmail(formData.email)) {
      newErrors.email = 'Email invÃ¡lido'
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha Ã© obrigatÃ³ria'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    try {
      await login(formData, '/dashboard')
      setErrors({})
    } catch (error) {
      console.error('Erro no login:', error)
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
            placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
          />
          {errors.password && <p className="form-error">{errors.password}</p>}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={formData.rememberMe}
            onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
            className="mr-2"
          />
          <label htmlFor="rememberMe" className="text-sm">
            Lembrar de mim
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoggingIn}
          className="btn btn-primary w-full"
        >
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

// ===== 2. COMPONENTE DE REGISTRO =====
export const RegisterExample: React.FC = () => {
  const { register, isRegistering } = useAuth()
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    phone: '',
    acceptTerms: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres'
    }

    if (!ValidationUtils.validateEmail(formData.email)) {
      newErrors.email = 'Email invÃ¡lido'
    }

    const passwordValidation = ValidationUtils.validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0]
    }

    if (formData.password !== formData.passwordConfirmation) {
      newErrors.passwordConfirmation = 'As senhas nÃ£o coincidem'
    }

    if (formData.phone && !ValidationUtils.validatePhone(formData.phone)) {
      newErrors.phone = 'Formato de telefone invÃ¡lido'
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'VocÃª deve aceitar os termos de uso'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await register(formData, '/dashboard')
    } catch (error) {
      console.error('Erro no registro:', error)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label label-required">Nome completo</label>
          <input
            type="text"
            className={`input ${errors.name ? 'input-error' : ''}`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Seu nome completo"
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>

        <div>
          <label className="label label-required">Email</label>
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
          <label className="label">Telefone</label>
          <input
            type="tel"
            className={`input ${errors.phone ? 'input-error' : ''}`}
            value={formData.phone}
            onChange={(e) => {
              const formatted = ValidationUtils.formatPhone(e.target.value)
              setFormData({ ...formData, phone: formatted })
            }}
            placeholder="(11) 99999-9999"
          />
          {errors.phone && <p className="form-error">{errors.phone}</p>}
        </div>

        <div>
          <label className="label label-required">Senha</label>
          <input
            type="password"
            className={`input ${errors.password ? 'input-error' : ''}`}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
          />
          {errors.password && <p className="form-error">{errors.password}</p>}
          <p className="form-help">
            MÃ­nimo 8 caracteres com letras maiÃºsculas, minÃºsculas, nÃºmeros e sÃ­mbolos
          </p>
        </div>

        <div>
          <label className="label label-required">Confirmar senha</label>
          <input
            type="password"
            className={`input ${errors.passwordConfirmation ? 'input-error' : ''}`}
            value={formData.passwordConfirmation}
            onChange={(e) => setFormData({ ...formData, passwordConfirmation: e.target.value })}
            placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
          />
          {errors.passwordConfirmation && (
            <p className="form-error">{errors.passwordConfirmation}</p>
          )}
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={formData.acceptTerms}
            onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
            className="mt-1 mr-2"
          />
          <label htmlFor="acceptTerms" className="text-sm">
            Aceito os{' '}
            <a href="/terms" className="text-blue-600 hover:underline">
              termos de uso
            </a>{' '}
            e{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">
              polÃ­tica de privacidade
            </a>
          </label>
        </div>
        {errors.acceptTerms && <p className="form-error">{errors.acceptTerms}</p>}

        <button
          type="submit"
          disabled={isRegistering}
          className="btn btn-primary w-full"
        >
          {isRegistering ? (
            <span className="flex items-center">
              <span className="spinner spinner-sm mr-2" />
              Criando conta...
            </span>
          ) : (
            'Criar conta'
          )}
        </button>
      </form>
    </div>
  )
}

// ===== 3. COMPONENTE DE PERFIL DO USUÃRIO =====
export const UserProfileExample: React.FC = () => {
  const { user, updateProfile, isUpdatingProfile, changePassword, isChangingPassword } = useAuth()
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPass, setIsChangingPass] = useState(false)
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || '',
  })

  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirmation: '',
  })

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(profileData)
      setIsEditingProfile(false)
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.newPasswordConfirmation) {
      toast.error('As senhas nÃ£o coincidem')
      return
    }

    try {
      await changePassword(passwordData)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        newPasswordConfirmation: '',
      })
      setIsChangingPass(false)
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
    }
  }

  if (!user) return <div>Carregando...</div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* InformaÃ§Ãµes bÃ¡sicas */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">InformaÃ§Ãµes Pessoais</h3>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="btn btn-outline btn-sm"
            >
              {isEditingProfile ? 'Cancelar' : 'Editar'}
            </button>
          </div>
        </div>
        
        <div className="card-body space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full" />
              ) : (
                <span className="text-xl font-semibold text-blue-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h4 className="font-semibold">{user.name}</h4>
              <p className="text-gray-600">{user.email}</p>
              <span className={`badge badge-${user.role === 'admin' ? 'primary' : 'gray'}`}>
                {user.role}
              </span>
            </div>
          </div>

          {isEditingProfile ? (
            <div className="space-y-4">
              <div>
                <label className="label">Nome</label>
                <input
                  type="text"
                  className="input"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="label">Telefone</label>
                <input
                  type="tel"
                  className="input"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>
              
              <div>
                <label className="label">Departamento</label>
                <input
                  type="text"
                  className="input"
                  value={profileData.department}
                  onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleProfileUpdate}
                  disabled={isUpdatingProfile}
                  className="btn btn-primary"
                >
                  {isUpdatingProfile ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="btn btn-outline"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p><strong>Telefone:</strong> {user.phone || 'NÃ£o informado'}</p>
              <p><strong>Departamento:</strong> {user.department || 'NÃ£o informado'}</p>
              <p><strong>Membro desde:</strong> {new Date(user.createdAt).toLocaleDateString('pt-BR')}</p>
            </div>
          )}
        </div>
      </div>

      {/* AlteraÃ§Ã£o de senha */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">SeguranÃ§a</h3>
            <button
              onClick={() => setIsChangingPass(!isChangingPass)}
              className="btn btn-outline btn-sm"
            >
              {isChangingPass ? 'Cancelar' : 'Alterar Senha'}
            </button>
          </div>
        </div>
        
        {isChangingPass && (
          <div className="card-body space-y-4">
            <div>
              <label className="label">Senha atual</label>
              <input
                type="password"
                className="input"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
            </div>
            
            <div>
              <label className="label">Nova senha</label>
              <input
                type="password"
                className="input"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </div>
            
            <div>
              <label className="label">Confirmar nova senha</label>
              <input
                type="password"
                className="input"
                value={passwordData.newPasswordConfirmation}
                onChange={(e) => setPasswordData({ ...passwordData, newPasswordConfirmation: e.target.value })}
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handlePasswordChange}
                disabled={isChangingPassword}
                className="btn btn-primary"
              >
                {isChangingPassword ? 'Alterando...' : 'Alterar Senha'}
              </button>
              <button
                onClick={() => setIsChangingPass(false)}
                className="btn btn-outline"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ===== 4. COMPONENTE DE PROTEÃ‡ÃƒO DE ROTA =====
interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'manager' | 'seller' | 'viewer'
  requiredPermission?: { resource: string; action: string }
  fallback?: React.ReactNode
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRole,
  requiredPermission,
  fallback
}) => {
  const { isAuthenticated, isLoading } = useRequireAuth()
  const { user, hasRole, hasPermission } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner spinner-lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return fallback || <div>Acesso negado</div>
  }

  // Verificar role especÃ­fico
  if (requiredRole && !hasRole(requiredRole)) {
    return fallback || (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Acesso Restrito</h2>
        <p className="text-gray-600 mt-2">
          VocÃª nÃ£o tem permissÃ£o para acessar esta pÃ¡gina.
        </p>
      </div>
    )
  }

  // Verificar permissÃ£o especÃ­fica
  if (requiredPermission && !hasPermission(requiredPermission.resource, requiredPermission.action)) {
    return fallback || (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">PermissÃ£o NecessÃ¡ria</h2>
        <p className="text-gray-600 mt-2">
          VocÃª nÃ£o tem permissÃ£o para {requiredPermission.action} em {requiredPermission.resource}.
        </p>
      </div>
    )
  }

  return <>{children}</>
}

// ===== 5. COMPONENTE DE HEADER COM USER MENU =====
export const UserMenuExample: React.FC = () => {
  const { user, logout, isLoggingOut } = useAuth()
  const { displayName, initials } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100"
      >
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          {user?.avatar ? (
            <img src={user.avatar} alt={displayName} className="w-8 h-8 rounded-full" />
          ) : (
            <span className="text-sm font-semibold text-blue-600">{initials}</span>
          )}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium">{displayName}</p>
          <p className="text-xs text-gray-500">{user?.role}</p>
        </div>
      </button>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="dropdown right-0">
            <div className="py-1">
              <a href="/profile" className="dropdown-item">
                Meu Perfil
              </a>
              <a href="/settings" className="dropdown-item">
                ConfiguraÃ§Ãµes
              </a>
              <div className="dropdown-divider" />
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="dropdown-item w-full text-left"
              >
                {isLoggingOut ? 'Saindo...' : 'Sair'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ===== 6. EXEMPLO DE USO DE PERMISSÃ•ES =====
export const PermissionExample: React.FC = () => {
  const { hasAccess } = usePermission('products', 'create')
  const { user, canAccess } = useAuth()

  return (
    <div className="space-y-4">
      <h3>Exemplos de VerificaÃ§Ã£o de PermissÃµes</h3>
      
      <div className="space-y-2">
        <p>Pode criar produtos: {hasAccess ? 'âœ…' : 'âŒ'}</p>
        <p>Pode editar usuÃ¡rios: {canAccess('users', 'update') ? 'âœ…' : 'âŒ'}</p>
        <p>Ã‰ administrador: {PermissionUtils.hasRole(user, 'admin') ? 'âœ…' : 'âŒ'}</p>
        <p>Tem role manager ou superior: {PermissionUtils.hasHigherRole(user, 'manager') ? 'âœ…' : 'âŒ'}</p>
      </div>

      {/* RenderizaÃ§Ã£o condicional baseada em permissÃµes */}
      {canAccess('products', 'create') && (
        <button className="btn btn-primary">
          Criar Produto
        </button>
      )}

      {canAccess('reports', 'export') && (
        <button className="btn btn-outline">
          Exportar RelatÃ³rios
        </button>
      )}
    </div>
  )
}

export default {
  LoginExample,
  RegisterExample,
  UserProfileExample,
  AuthGuard,
  UserMenuExample,
  PermissionExample,
}

