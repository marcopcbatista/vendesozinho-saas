import { createClient } from '@supabase/supabase-js';
import { logger } from './logger.js';

// Verificar variÃ¡veis de ambiente obrigatÃ³rias
const supabaseUrl = globalThis.process?.env.SUPABASE_URL;
const supabaseServiceKey = globalThis.process?.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  logger.error('Missing Supabase configuration', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseServiceKey
  });
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
}

// Validar formato da URL
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  logger.error('Invalid Supabase URL format', { url: supabaseUrl });
  throw new Error('SUPABASE_URL must have format: https://your-project.supabase.co');
}

// Validar service key
if (!supabaseServiceKey.startsWith('eyJ')) {
  logger.error('Invalid Supabase service key format');
  throw new Error('SUPABASE_SERVICE_ROLE_KEY must start with "eyJ"');
}

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    headers: {
      'User-Agent': 'vendeSozinho/1.0.0'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

/**
 * Testar conexÃ£o com Supabase
 * @returns {Promise<boolean>} True se conectado, false caso contrÃ¡rio
 */
export const testSupabaseConnection = async () => {
  try {
    const { error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') {
      logger.error('Supabase connection test failed', { error: error.message });
      return false;
    }
    
    logger.info('Supabase connection established successfully');
    return true;
  } catch (error) {
    logger.error('Supabase connection error', { error: error.message });
    return false;
  }
};

/**
 * Verificar se tabela existe
 * @param {string} tableName - Nome da tabela
 * @returns {Promise<boolean>}
 */
export const tableExists = async (tableName) => {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('count')
      .limit(1);
    
    return !error;
  } catch (error) {
    logger.warn(`Table check failed for ${tableName}`, { error: error.message });
    return false;
  }
};

/**
 * Executar migraÃ§Ã£o/setup inicial das tabelas
 */
export const setupDatabase = async () => {
  try {
    logger.info('Setting up database schema...');
    
    // Verificar se as tabelas principais existem
    const tables = ['users', 'subscriptions', 'generations', 'templates', 'leads'];
    const tableStatus = {};
    
    for (const table of tables) {
      tableStatus[table] = await tableExists(table);
    }
    
    logger.info('Database table status:', tableStatus);
    
    // Se alguma tabela crÃ­tica nÃ£o existir, log warning
    const missingTables = tables.filter(table => !tableStatus[table]);
    if (missingTables.length > 0) {
      logger.warn('Missing database tables', { missing: missingTables });
      logger.info('Please run database migration script or create tables manually');
    } else {
      logger.info('All required tables exist');
    }
    
    return true;
  } catch (error) {
    logger.error('Database setup failed', { error: error.message });
    return false;
  }
};

/**
 * FunÃ§Ãµes utilitÃ¡rias para queries comuns
 */
export const queries = {
  // UsuÃ¡rios
  async findUserById(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async findUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUser(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // GeraÃ§Ãµes de IA
  async saveGeneration(generationData) {
    const { data, error } = await supabase
      .from('generations')
      .insert([generationData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserGenerations(userId, limit = 10, offset = 0) {
    const { data, error } = await supabase
      .from('generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  },

  // Leads
  async createLead(leadData) {
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getLeadStats(userId) {
    const { data, error } = await supabase
      .rpc('get_lead_stats', { user_id: userId });
    
    if (error) throw error;
    return data;
  },

  // Templates
  async getTemplates(isPublic = true) {
    let query = supabase
      .from('templates')
      .select('*');
    
    if (isPublic) {
      query = query.eq('is_public', true);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) throw error;
    return data;
  }
};

// Inicializar conexÃ£o ao importar
if (globalThis.process?.env.NODE_ENV === 'development') {
  testSupabaseConnection().catch(error => {
    logger.error('Initial Supabase connection failed', { error: error.message });
  });
}

export default supabase;
