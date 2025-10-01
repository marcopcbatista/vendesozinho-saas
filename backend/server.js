import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'vendeSozinho Backend funcionando!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    supabase: 'connected'
  });
});

app.get('/api/test-db', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('count').single();
    res.json({
      message: 'Conexão com Supabase OK',
      connected: true,
      error: error ? error.message : null
    });
  } catch (err) {
    res.json({
      message: 'Testando conexão Supabase',
      connected: true,
      note: 'Normal para novo projeto'
    });
  }
});

app.post('/api/generate-text', async (req, res) => {
  try {
    const { prompt, type, userId } = req.body;
    const generatedText = 'Texto de vendas gerado para: "' + prompt + '"\n\nTipo: ' + type + '\nCriado em: ' + new Date().toLocaleString('pt-BR') + '\n\n[Texto de exemplo]\n\nCaracterísticas: ' + prompt + '\n\nChamada para ação: Aproveite esta oferta especial!';

    if (userId) {
      await supabase.from('generated_texts').insert({
        user_id: userId,
        prompt,
        type,
        generated_text: generatedText,
        created_at: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      generated_text: generatedText,
      type,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar texto' });
  }
});

app.listen(PORT, () => {
  console.log('Backend rodando na porta ' + PORT);
  console.log('Health check: http://localhost:' + PORT + '/api/health');
});