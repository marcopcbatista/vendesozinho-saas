import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { supabase, queries } from '../config/database.js';
import { logger } from '../config/logger.js';

class AuthService {
  constructor() {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    this.jwtSecret = process.env.JWT_SECRET;
    this.jwtExpiry = process.env.JWT_EXPIRES_IN || '7d';
    
    if (!this.jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required');
    }
  }

  /**
   * Verificar token do Google OAuth
   * @param {string} token - Token ID do Google
   * @returns {Object} Dados do usuário do Google
   */
  async verifyGoogleToken(token) {
    try {
      if (!process.env.GOOGLE_CLIENT_ID) {
        throw new Error('GOOGLE_CLIENT_ID não configurado');
      }

      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      
      // Validar dados essenciais
      if (!payload.sub || !payload.email || !payload.name) {
        throw new Error('Dados do Google incompletos');
      }

      return {
        google_id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        email_verified: payload.email_verified || false,
        locale: payload.locale || 'pt-BR'
      };
    } catch (error) {
      logger.error('Google token verification failed', { error: error.message });
      throw new Error('Token Google inválido ou expirado');
    }
  }

  /**
   * Encontrar ou criar usuário baseado nos dados do Google
   * @param {Object} googleData - Dados do usuário do Google
   * @returns {Object} Usuário criado ou encontrado
   */
  async findOrCreateUser(googleData) {
    try {
      // Buscar usuário existente por Google ID ou email
      const { data: existingUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .or(`google_id.eq.${googleData.google_id},email.eq.${googleData.email}`)
        .single();

      if (findError && findError.code !== 'PGRST116') {
        logger.error('User lookup failed', { error: findError.message });
        throw new Error('Erro ao verificar usuário existente');
      }

      if (existingUser) {
        // Usuario existe - atualizar dados se necessário
        return await this.updateExistingUser(existingUser, googleData);
      }

      // Criar novo usuário
      return await this.createNewUser(googleData);

    } catch (error) {
      logger.error('findOrCreateUser failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Atualizar usuário existente
   * @private
   */
  async updateExistingUser(existingUser, googleData) {
    const updates = {
      last_login: new Date().toISOString()
    };

    // Atualizar Google ID se não existir
    if (!existingUser.google_id && googleData.google_id) {
      updates.google_id = googleData.google_id;
    }

    // Atualizar foto se não existir ou mudou
    if (!existingUser.picture || existingUser.picture !== googleData.picture) {
      updates.picture = googleData.picture;
    }

    // Atualizar nome se mudou
    if (existingUser.name !== googleData.name) {
      updates.name = googleData.name;
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', existingUser.id)
      .select()
      .single();

    if (updateError) {
      logger.warn('User update failed', { 
        userId: existingUser.id, 
        error: updateError.message 
      });
    }

    logger.info('Existing user updated', { 
      userId: existingUser.id, 
      email: existingUser.email 
    });

    return updatedUser || existingUser;
  }

  /**
   * Criar novo usuário
   * @private
   */
  async createNewUser(googleData) {
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 14); // 14 dias de trial

    const newUserData = {
      google_id: googleData.google_id,
      email: googleData.email,
      name: googleData.name,
      picture: googleData.picture,
      email_verified: googleData.email_verified,
      subscription_status: 'trial',
      subscription_plan: 'trial',
      trial_ends_at: trialEndDate.toISOString(),
      is_active: true,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      locale: googleData.locale
    };

    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([newUserData])
      .select()
      .single();

    if (createError) {
      logger.error('User creation failed', { 
        email: googleData.email, 
        error: createError.message 
      });
      throw new Error('Não foi possível criar conta de usuário');
    }

    logger.info('New user created', { 
      userId: newUser.id, 
      email: newUser.email 
    });
    
    // Enviar email de boas-vindas assíncronamente
    this.sendWelcomeEmail(newUser).catch(err => {
      logger.warn('Welcome email failed', { 
        userId: newUser.id, 
        error: err.message 
      });
    });

    return newUser;
  }

  /**
   * Gerar token JWT
   * @param {Object} user - Dados do usuário
   * @returns {string} Token JWT
   */
  generateJWT(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      subscriptionStatus: user.subscription_status,
      subscriptionPlan: user.subscription_plan,
      isActive: user.is_active,
      iat: Math.floor(Date.now() / 1000)
    };

    const options = {
      expiresIn: this.jwtExpiry,
      issuer: 'vendesozinho',
      subject: user.id.toString(),
      audience: process.env.FRONTEND_URL || 'localhost'
    };

    return jwt.sign(payload, this.jwtSecret, options);
  }

  /**
   * Verificar token JWT
   * @param {string} token - Token JWT
   * @returns {Object} Payload decodificado
   */
  verifyJWT(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Token JWT inválido ou expirado');
    }
  }

  /**
   * Renovar token JWT
   * @param {string} userId - ID do usuário
   * @returns {string} Novo token JWT
   */
  async refreshToken(userId) {
    try {
      const user = await this.getUserById(userId);
      
      if (!user.is_active) {
        throw new Error('Usuário inativo');
      }

      // Atualizar último acesso
      await this.updateLastLogin(userId);

      return this.generateJWT(user);
    } catch (error) {
      logger.error('Token refresh failed', { userId, error: error.message });
      throw new Error('Não foi possível renovar token');
    }
  }

  /**
   * Obter usuário por ID
   * @param {string} userId - ID do usuário
   * @returns {Object} Dados do usuário
   */
  async getUserById(userId) {
    try {
      const user = await queries.findUserById(userId);
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Calcular dias restantes do trial
      if (user.trial_ends_at) {
        const trialEnd = new Date(user.trial_ends_at);
        const now = new Date();
        const daysLeft = Math.max(0, Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24)));
        user.trial_days_left = daysLeft;
        user.trial_expired = daysLeft === 0 && user.subscription_status === 'trial';
      }

      return user;
    } catch (error) {
      logger.error('Get user by ID failed', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Obter usuário por email
   * @param {string} email - Email do usuário
   * @returns {Object|null} Dados do usuário ou null
   */
  async getUserByEmail(email) {
    try {
      return await queries.findUserByEmail(email);
    } catch (error) {
      logger.error('Get user by email failed', { email, error: error.message });
      return null;
    }
  }

  /**
   * Atualizar usuário
   * @param {string} userId - ID do usuário
   * @param {Object} updates - Dados para atualizar
   * @returns {Object} Usuário atualizado
   */
  async updateUser(userId, updates) {
    try {
      return await queries.updateUser(userId, updates);
    } catch (error) {
      logger.error('Update user failed', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Atualizar último login
   * @param {string} userId - ID do usuário
   */
  async updateLastLogin(userId) {
    try {
      await supabase
        .from('users')
        .update({ 
          last_login: new Date().toISOString() 
        })
        .eq('id', userId);
    } catch (error) {
      logger.warn('Update last login failed', { userId, error: error.message });
      // Não falhar por erro no update de last_login
    }
  }

  /**
   * Registrar logout
   * @param {string} userId - ID do usuário
   */
  async logout(userId) {
    try {
      await supabase
        .from('users')
        .update({ 
          last_logout: new Date().toISOString() 
        })
        .eq('id', userId);

      logger.info('User logout recorded', { userId });
      return { success: true };
    } catch (error) {
      logger.warn('Logout recording failed', { userId, error: error.message });
      return { success: true }; // Não falhar logout por erro no banco
    }
  }

  /**
   * Desativar conta do usuário
   * @param {string} userId - ID do usuário
   * @param {string} reason - Motivo da desativação
   */
  async deactivateUser(userId, reason = 'user_request') {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          is_active: false,
          deactivated_at: new Date().toISOString(),
          deactivation_reason: reason
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      logger.info('User account deactivated', { userId, reason });
      return { success: true };
    } catch (error) {
      logger.error('Account deactivation failed', { userId, error: error.message });
      throw new Error('Não foi possível desativar conta');
    }
  }

  /**
   * Verificar permissões do usuário
   * @param {Object} user - Dados do usuário
   * @param {string} permission - Permissão a verificar
   * @returns {boolean} Se tem permissão
   */
  hasPermission(user, permission) {
    if (!user.is_active) return false;

    const permissions = {
      trial: [
        'basic_generator',
        'basic_templates',
        'profile_view'
      ],
      active: [
        'basic_generator',
        'basic_templates', 
        'advanced_templates',
        'history_view',
        'profile_view',
        'profile_edit'
      ],
      premium: [
        'basic_generator',
        'basic_templates', 
        'advanced_templates',
        'history_view',
        'profile_view',
        'profile_edit',
        'api_access',
        'priority_support',
        'unlimited_generations'
      ]
    };

    const userPermissions = permissions[user.subscription_status] || [];
    return userPermissions.includes(permission);
  }

  /**
   * Verificar se usuário pode usar recurso
   * @param {Object} user - Dados do usuário
   * @param {string} feature - Recurso a verificar
   * @returns {Object} Status de acesso
   */
  canAccessFeature(user, feature) {
    if (!user.is_active) {
      return { 
        allowed: false, 
        reason: 'account_disabled',
        message: 'Conta desativada' 
      };
    }

    // Se trial expirou
    if (user.subscription_status === 'trial' && user.trial_expired) {
      return { 
        allowed: false, 
        reason: 'trial_expired',
        message: 'Período de teste expirou' 
      };
    }

    // Verificar limites por plano
    const limits = {
      trial: {
        generations_per_month: 10,
        templates_access: 'basic',
        history_days: 7
      },
      active: {
        generations_per_month: 100,
        templates_access: 'all',
        history_days: 90
      },
      premium: {
        generations_per_month: -1, // unlimited
        templates_access: 'all',
        history_days: -1 // unlimited
      }
    };

    const userLimits = limits[user.subscription_status] || limits.trial;

    return {
      allowed: true,
      limits: userLimits
    };
  }

  /**
   * Enviar email de boas-vindas
   * @param {Object} user - Dados do usuário
   */
  async sendWelcomeEmail(user) {
    try {
      logger.info('Would send welcome email', { 
        userId: user.id, 
        email: user.email 
      });
      
      // TODO: Implementar com provedor de email real
      // Exemplo: SendGrid, Mailgun, AWS SES, etc.
      
      // Webhook opcional para notificações
      if (process.env.WEBHOOK_URL) {
        const axios = await import('axios');
        await axios.default.post(process.env.WEBHOOK_URL, {
          event: 'user_registered',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at
          }
        });
      }
    } catch (error) {
      logger.warn('Welcome email/webhook failed', { 
        userId: user.id, 
        error: error.message 
      });
    }
  }

  /**
   * Validar dados do usuário
   * @param {Object} userData - Dados a validar
   * @returns {Object} Resultado da validação
   */
  validateUserData(userData) {
    const errors = [];

    if (!userData.email || !/\S+@\S+\.\S+/.test(userData.email)) {
      errors.push('Email inválido');
    }

    if (!userData.name || userData.name.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Obter estatísticas do usuário
   * @param {string} userId - ID do usuário
   * @returns {Object} Estatísticas
   */
  async getUserStats(userId) {
    try {
      // Total de gerações
      const { count: totalGenerations } = await supabase
        .from('generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Gerações este mês
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: monthlyGenerations } = await supabase
        .from('generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString());

      return {
        total_generations: totalGenerations || 0,
        monthly_generations: monthlyGenerations || 0,
        account_age_days: Math.floor(
          (new Date() - new Date(await this.getUserById(userId).created_at)) / 
          (1000 * 60 * 60 * 24)
        )
      };
    } catch (error) {
      logger.error('Get user stats failed', { userId, error: error.message });
      return {
        total_generations: 0,
        monthly_generations: 0,
        account_age_days: 0
      };
    }
  }
}

export default new AuthService();