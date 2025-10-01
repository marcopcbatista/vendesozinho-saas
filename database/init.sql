-- Tabela de textos gerados
CREATE TABLE IF NOT EXISTS generated_texts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  generated_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_generated_texts_user_id ON generated_texts(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_texts_created_at ON generated_texts(created_at);

-- RLS (Row Level Security)
ALTER TABLE generated_texts ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seus próprios textos
CREATE POLICY "Users can view own generated texts" ON generated_texts
  FOR SELECT USING (auth.uid() = user_id);

-- Política para usuários inserirem textos
CREATE POLICY "Users can insert own generated texts" ON generated_texts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
