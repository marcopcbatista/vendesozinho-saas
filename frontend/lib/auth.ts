import jwt from 'jsonwebtoken'
import { supabaseAdmin } from './supabase'
import type { User } from './supabase'

// Configurações JWT
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não configurado no .env.local')
}

// Interface para dados do Google
export interface GoogleUserData {
  google_id: string
  email: string
  name: string
  picture?: string
  email_verified?: boolean
}

// Interface para payload do JWT
export interface JWTPayload {
  userId: string
  email: string
  name: string
  picture?: string
  subscriptionStatus: string
  isActive: boolean
  iat?: number
  exp?: number
}

class AuthService {
  // Verificar token Google usando fetch (sem dependência externa)
  async verifyGoogleToken(token: string): Promise<GoogleUserData> {
    try {
      // Verificar token com endpoint do Google
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
      
      if (!response.ok) {
        throw new Error('Token Google inválido')
      }

      const payload = await response.json()

      // Validar se é nosso app
      if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
        throw new Error('Token não pertence a esta aplicação')
      }

      // Validar dados essenciais
      if (!payload.sub || !payload.email || !payload.name) {
        throw new Error('Dados do Google incompletos')
      }

      return {
        google_id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        email_verified: payload.email_verified || false
      }
    } catch (error) {
      console.error('Erro ao verificar token Google:', error)
      throw new Error('Token Google inválido ou expirado')
    }
  }

  // Criar ou buscar usuário
  async findOrCreateUser(googleData: GoogleUserData): Promise<User> {
    if (!supabaseAdmin) {
      throw new Error('supabaseAdmin não configurado')
    }

    try {
      // Buscar usuário existente por Google ID ou email
      const { data: existingUser, error: findError } = await supabaseAdmin
        .from('users')
        .select('*')
        .or(`google_id.eq.${googleData.google_id},email.eq.${googleData.email}`)
        .single()

      if (findError && findError.code !== 'PGRST116') {
        console.error('Erro ao buscar usuário:', findError)
        throw new Error('Erro ao verificar usuário existente')
      }

      if (existingUser) {
        // Usuário existe - atualizar dados se necessário
        const updates: any = {
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        // Atualizar Google ID se não existir
        if (!existingUser.google_id && googleData.google_id) {
          updates.google_id = googleData.google_id
        }

        // Atualizar foto se mudou
        if (!existingUser.picture || existingUser.picture !== googleData.picture) {
          updates.picture = googleData.picture
        }

        // Atualizar nome se mudou
        if (existingUser.name !== googleData.name) {
          updates.name = googleData.name
        }

        const { data: updatedUser, error: updateError } = await supabaseAdmin
          .from('users')
          .update(updates)
          .eq('id', existingUser.id)
          .select()
          .single()

        if (updateError) {
          console.warn('Erro ao atualizar usuário:', updateError)
        }

        console.log(`Usuário existente logado: ${existingUser.email}`)
        return updatedUser || existingUser
      }

      // Criar novo usuário
      const newUserData = {
        google_id: googleData.google_id,
        email: googleData.email,
        name: googleData.name,
        picture: googleData.picture,
        subscription_status: 'trial' as const,
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 dias
        is_active: true,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      }

      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert([newUserData])
        .select()
        .single()

      if (createError) {
        console.error('Erro ao criar usuário:', createError)
        throw new Error('Não foi possível criar conta de usuário')
      }

      console.log(`Novo usuário criado: ${newUser.email} (ID: ${newUser.id})`)
      
      // Trigger para webhook de boas-vindas
      this.sendWelcomeWebhook(newUser).catch(err => {
        console.warn('Falha ao enviar webhook de boas-vindas:', err.message)
      })

      return newUser

    } catch (error) {
      console.error('Erro no findOrCreateUser:', error)
      throw error
    }
  }

  // Gerar JWT token
  generateJWT(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture || undefined,
      subscriptionStatus: user.subscription_status,
      isActive: user.is_active
    }

    const options = {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'vendesozinho',
      subject: user.id,
      audience: process.env.NEXT_PUBLIC_APP_URL || 'localhost'
    }

    return jwt.sign(payload, JWT_SECRET!, options)
  }

  // Verificar JWT token
  verifyJWT(token: string): JWTPayload {
    try {
      return jwt.verify(token, JWT_SECRET!) as JWTPayload
    } catch (error) {
      throw new Error('Token JWT inválido ou expirado')
    }
  }

  // Refresh token
  async refreshToken(userId: string): Promise<string> {
    if (!supabaseAdmin) {
      throw new Error('supabaseAdmin não configurado')
    }

    try {
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', userId)
        .eq('is_active', true)
        .single()

      if (error || !user) {
        throw new Error('Usuário não encontrado ou inativo')
      }

      // Atualizar último acesso
      await supabaseAdmin
        .from('users')
        .update({ 
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      return this.generateJWT(user)
    } catch (error) {
      console.error('Erro ao refresh token:', error)
      throw new Error('Não foi possível renovar token')
    }
  }

  // Obter dados do usuário por ID
  async getUserById(userId: string): Promise<User & { trial_days_left?: number }> {
    if (!supabaseAdmin) {
      throw new Error('supabaseAdmin não configurado')
    }

    try {
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error || !user) {
        throw new Error('Usuário não encontrado')
      }

      // Calcular dias restantes do trial
      const userWithTrial = { ...user }
      if (user.trial_ends_at) {
        const trialEnd = new Date(user.trial_ends_at)
        const now = new Date()
        const daysLeft = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
        userWithTrial.trial_days_left = daysLeft
      }

      return userWithTrial
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      throw error
    }
  }

  // Verificar permissões do usuário
  hasPermission(user: User, resource: string): boolean {
    if (!user.is_active) {
      return false
    }

    // Lógica de permissões baseada na assinatura
    const permissions = {
      trial: ['basic_leads', 'basic_dashboard', 'whatsapp_bot'],
      active: ['basic_leads', 'basic_dashboard', 'whatsapp_bot', 'advanced_features', 'api_access'],
      premium: ['basic_leads', 'basic_dashboard', 'whatsapp_bot', 'advanced_features', 'api_access', 'priority_support', 'custom_integrations']
    }

    const userPermissions = permissions[user.subscription_status as keyof typeof permissions] || []
    return userPermissions.includes(resource)
  }

  // Verificar se trial expirou
  isTrialExpired(user: User): boolean {
    if (user.subscription_status !== 'trial' || !user.trial_ends_at) {
      return false
    }

    return new Date(user.trial_ends_at) < new Date()
  }

  // Desativar conta
  async deactivateUser(userId: string, reason: string = 'user_request'): Promise<{ success: boolean }> {
    if (!supabaseAdmin) {
      throw new Error('supabaseAdmin não configurado')
    }

    try {
      const { error } = await supabaseAdmin
        .from('users')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        throw error
      }

      console.log(`Usuário ${userId} desativado. Motivo: ${reason}`)
      return { success: true }
    } catch (error) {
      console.error('Erro ao desativar usuário:', error)
      throw new Error('Não foi possível desativar conta')
    }
  }

  // Webhook de boas-vindas
  private async sendWelcomeWebhook(user: User): Promise<void> {
    if (!process.env.WEBHOOK_URL) {
      return
    }

    try {
      await fetch(process.env.WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'user_registered',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            subscription_status: user.subscription_status
          }
        })
      })
    } catch (error) {
      console.warn('Falha ao enviar webhook de registro:', error)
    }
  }

  // Atualizar status de assinatura (para webhook do Stripe)
  async updateSubscriptionStatus(
    userId: string, 
    status: 'trial' | 'active' | 'inactive' | 'premium',
    subscriptionData?: {
      stripe_customer_id?: string
      stripe_subscription_id?: string
      current_period_end?: string
    }
  ): Promise<void> {
    if (!supabaseAdmin) {
      throw new Error('supabaseAdmin não configurado')
    }

    try {
      const updates: any = {
        subscription_status: status,
        updated_at: new Date().toISOString()
      }

      // Se não é mais trial, remover data de fim do trial
      if (status !== 'trial') {
        updates.trial_ends_at = null
      }

      const { error } = await supabaseAdmin
        .from('users')
        .update(updates)
        .eq('id', userId)

      if (error) {
        throw error
      }

      // Se há dados de assinatura, criar/atualizar na tabela subscriptions
      if (subscriptionData && subscriptionData.stripe_subscription_id) {
        const { error: subError } = await supabaseAdmin
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_customer_id: subscriptionData.stripe_customer_id!,
            stripe_subscription_id: subscriptionData.stripe_subscription_id,
            stripe_price_id: 'price_default', // Você pode mapear isso baseado no plano
            plan_name: status === 'premium' ? 'Premium' : 'Professional',
            status: status === 'active' || status === 'premium' ? 'active' : 'inactive',
            current_period_start: new Date().toISOString(),
            current_period_end: subscriptionData.current_period_end || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'stripe_subscription_id'
          })

        if (subError) {
          console.error('Erro ao atualizar subscription:', subError)
        }
      }

      console.log(`Status de assinatura atualizado para usuário ${userId}: ${status}`)
    } catch (error) {
      console.error('Erro ao atualizar status de assinatura:', error)
      throw error
    }
  }
}

export const authService = new AuthService()

// Middleware helper para verificar autenticação em API routes
export function withAuth<T extends any[]>(
  handler: (req: any, res: any, user: User, ...args: T) => Promise<any>
) {
  return async (req: any, res: any, ...args: T) => {
    try {
      const authHeader = req.headers.authorization
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token não fornecido' })
      }

      const token = authHeader.substring(7)
      const payload = authService.verifyJWT(token)
      const user = await authService.getUserById(payload.userId)

      if (!user.is_active) {
        return res.status(401).json({ error: 'Conta desativada' })
      }

      return handler(req, res, user, ...args)
    } catch (error) {
      console.error('Erro na autenticação:', error)
      return res.status(401).json({ error: 'Token inválido' })
    }
  }
}
