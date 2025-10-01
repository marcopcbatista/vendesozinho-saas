import express from 'express';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import authService from '../services/authService.js';
import { logger } from '../config/logger.js';
import { optionalAuth, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Rate limiting para rotas de auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas de login por IP
  message: {
    success: false,
    error: 'Muitas tentativas de login',
    message: 'Tente novamente em 15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Pular rate limit para verificação de token
    return req.path === '/verify' || req.path === '/refresh';
  }
});

// Middleware de validação para login Google
const validateGoogleLogin = [
  body('token')
    .notEmpty()
    .withMessage('Token do Google é obrigatório')
    .isLength({ min: 10 })
    .withMessage('Token inválido')
];

// Middleware para verificar erros de validação
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Dados inválidos',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * @route POST /api/auth/google
 * @desc Login/Register com Google OAuth
 * @access Public
 */
router.post('/google', 
  authLimiter,
  validateGoogleLogin,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { token: googleToken } = req.body;

      logger.info('Google OAuth login attempt', {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      // Verificar token do Google
      const googleData = await authService.verifyGoogleToken(googleToken);
      
      // Encontrar ou criar usuário
      const user = await authService.findOrCreateUser(googleData);
      
      // Gerar JWT token
      const jwtToken = authService.generateJWT(user);

      // Atualizar último login
      await authService.updateLastLogin(user.id);

      logger.info('Google OAuth login successful', {
        userId: user.id,
        email: user.email,
        isNewUser: !user.last_login
      });

      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            subscription_status: user.subscription_status,
            trial_ends_at: user.trial_ends_at,
            trial_days_left: user.trial_days_left || 0
          },
          token: jwtToken
        }
      });

    } catch (error) {
      logger.error('Google OAuth login failed', {
        error: error.message,
        stack: error.stack,
        ip: req.ip
      });

      const statusCode = error.message.includes('Token Google') ? 401 : 500;
      
      res.status(statusCode).json({
        success: false,
        error: 'Falha no login',
        message: error.message || 'Não foi possível fazer login com Google'
      });
    }
  }
);

/**
 * @route POST /api/auth/verify
 * @desc Verificar se token JWT é válido
 * @access Public
 */
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token não fornecido'
      });
    }

    const decoded = authService.verifyJWT(token);
    const user = await authService.getUserById(decoded.userId);

    res.json({
      success: true,
      valid: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          subscription_status: user.subscription_status,
          trial_days_left: user.trial_days_left || 0
        }
      }
    });

  } catch (error) {
    logger.warn('Token verification failed', { error: error.message });
    
    res.status(401).json({
      success: false,
      valid: false,
      error: 'Token inválido',
      message: error.message
    });
  }
});

/**
 * @route POST /api/auth/refresh
 * @desc Renovar token JWT
 * @access Private
 */
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Gerar novo token
    const newToken = await authService.refreshToken(userId);

    logger.info('Token refreshed', { userId });

    res.json({
      success: true,
      message: 'Token renovado com sucesso',
      data: {
        token: newToken,
        user: req.user
      }
    });

  } catch (error) {
    logger.error('Token refresh failed', {
      userId: req.user?.id,
      error: error.message
    });

    res.status(401).json({
      success: false,
      error: 'Falha na renovação',
      message: 'Não foi possível renovar token'
    });
  }
});

/**
 * @route GET /api/auth/profile
 * @desc Obter perfil do usuário autenticado
 * @access Private
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          subscription_status: user.subscription_status,
          subscription_plan: user.subscription_plan,
          trial_ends_at: user.trial_ends_at,
          trial_days_left: user.trial_days_left || 0,
          is_active: user.is_active,
          created_at: user.created_at,
          last_login: user.last_login
        }
      }
    });

  } catch (error) {
    logger.error('Profile fetch failed', {
      userId: req.user.id,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Falha ao buscar perfil',
      message: 'Não foi possível obter dados do perfil'
    });
  }
});

/**
 * @route PUT /api/auth/profile
 * @desc Atualizar perfil do usuário
 * @access Private
 */
router.put('/profile', 
  authenticateToken,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Nome deve ter entre 2 e 100 caracteres'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Email deve ser válido')
      .normalizeEmail()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, email } = req.body;
      const userId = req.user.id;

      const updates = {};
      if (name) updates.name = name;
      if (email && email !== req.user.email) {
        // Verificar se email já existe
        const existingUser = await authService.getUserByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({
            success: false,
            error: 'Email já em uso',
            message: 'Este email já está sendo usado por outra conta'
          });
        }
        updates.email = email;
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Nenhuma alteração fornecida'
        });
      }

      updates.updated_at = new Date().toISOString();
      
      const updatedUser = await authService.updateUser(userId, updates);

      logger.info('Profile updated', { 
        userId, 
        updates: Object.keys(updates) 
      });

      res.json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        data: {
          user: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            picture: updatedUser.picture,
            subscription_status: updatedUser.subscription_status
          }
        }
      });

    } catch (error) {
      logger.error('Profile update failed', {
        userId: req.user.id,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Falha na atualização',
        message: 'Não foi possível atualizar perfil'
      });
    }
  }
);

/**
 * @route POST /api/auth/logout
 * @desc Fazer logout (registrar no banco)
 * @access Private
 */
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    await authService.logout(userId);

    logger.info('User logged out', { userId });

    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });

  } catch (error) {
    logger.warn('Logout error', {
      userId: req.user?.id,
      error: error.message
    });

    // Não falhar logout por erro no banco
    res.json({
      success: true,
      message: 'Logout realizado'
    });
  }
});

/**
 * @route DELETE /api/auth/account
 * @desc Desativar conta do usuário
 * @access Private
 */
router.delete('/account', 
  authenticateToken,
  [
    body('reason')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Motivo deve ter no máximo 500 caracteres')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { reason = 'user_request' } = req.body;

      await authService.deactivateUser(userId, reason);

      logger.info('Account deactivated', { userId, reason });

      res.json({
        success: true,
        message: 'Conta desativada com sucesso',
        data: {
          deactivated_at: new Date().toISOString()
        }
      });

    } catch (error) {
      logger.error('Account deactivation failed', {
        userId: req.user.id,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: 'Falha na desativação',
        message: 'Não foi possível desativar conta'
      });
    }
  }
);

/**
 * @route GET /api/auth/me
 * @desc Endpoint simples para verificar autenticação
 * @access Private
 */
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        subscription_status: req.user.subscription_status
      }
    }
  });
});

export default router;