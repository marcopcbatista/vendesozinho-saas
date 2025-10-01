// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0
    };

    const conn = await mongoose.connect(process.env.DB_URI, options);
    
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📊 Banco de dados: ${conn.connection.name}`);
    
    // Event listeners para monitoramento
    mongoose.connection.on('error', (err) => {
      console.error('❌ Erro no MongoDB:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB desconectado');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconectado');
    });
    
  } catch (error) {
    console.error(`❌ Erro ao conectar no MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

// ============================================

// config/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validações
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Variáveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias');
  process.exit(1);
}

if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  console.error('❌ Erro: SUPABASE_URL inválida');
  process.exit(1);
}

if (!supabaseServiceKey.startsWith('eyJ')) {
  console.error('❌ Erro: SUPABASE_SERVICE_ROLE_KEY inválida');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    headers: {
      'User-Agent': 'vendeSozinho/1.0.0'
    }
  }
});

// Teste de conexão
const testConnection = async () => {
  try {
    const { error } = await supabase.from('users').select('count').limit(1);
    if (error && error.code !== 'PGRST116') {
      console.error('❌ Erro na conexão com Supabase:', error.message);
    } else {
      console.log('✅ Conexão com Supabase estabelecida');
    }
  } catch (error) {
    console.error('❌ Erro ao testar Supabase:', error.message);
  }
};

if (process.env.NODE_ENV === 'development') {
  testConnection();
}

export default supabase;

// ============================================

// config/openai.js
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY é obrigatória');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Função auxiliar para gerar texto
export const gerarTexto = async (prompt, options = {}) => {
  try {
    const completion = await openai.chat.completions.create({
      model: options.model || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: options.systemPrompt || "Você é um especialista em copywriting e vendas."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Erro ao gerar texto:', error);
    throw new Error('Falha ao gerar texto com IA');
  }
};

export default openai;

// ============================================

// config/stripe.js
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY é obrigatória');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// Função auxiliar para criar sessão de checkout
export const createCheckoutSession = async (priceData, customerId = null) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: { 
              name: priceData.name,
              description: priceData.description 
            },
            unit_amount: priceData.amount, // em centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      customer: customerId,
      metadata: priceData.metadata || {}
    });

    return session;
  } catch (error) {
    console.error('Erro ao criar sessão Stripe:', error);
    throw new Error('Falha ao criar sessão de pagamento');
  }
};

export default stripe;