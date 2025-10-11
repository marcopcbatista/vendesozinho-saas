-- =====================================================
-- MIGRAÇÃO: Adicionar colunas de autenticação
-- =====================================================

-- 1. Adicionar colunas faltantes na tabela users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS password_hash TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false NOT NULL,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false NOT NULL,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true NOT NULL;

-- 2. Atualizar usuários existentes
UPDATE users 
SET 
  is_active = true,
  email_verified = false,
  phone_verified = false
WHERE is_active IS NULL;

-- 3. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- 4. Criar tabela de refresh tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- 5. Criar tabela de tokens de reset de senha
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);

-- 6. Criar tabela de tokens de verificação de email
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_token ON email_verification_tokens(token);

-- 7. Habilitar RLS nas novas tabelas
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- 8. Políticas RLS para refresh_tokens
CREATE POLICY "Users can view own refresh tokens" ON refresh_tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own refresh tokens" ON refresh_tokens
  FOR DELETE USING (auth.uid() = user_id);

-- 9. Políticas RLS para password_reset_tokens
CREATE POLICY "Users can view own reset tokens" ON password_reset_tokens
  FOR SELECT USING (auth.uid() = user_id);

-- 10. Políticas RLS para email_verification_tokens
CREATE POLICY "Users can view own verification tokens" ON email_verification_tokens
  FOR SELECT USING (auth.uid() = user_id);

-- 11. Comentários nas colunas
COMMENT ON COLUMN users.full_name IS 'Nome completo do usuário';
COMMENT ON COLUMN users.phone IS 'Telefone do usuário (único)';
COMMENT ON COLUMN users.password_hash IS 'Hash bcrypt da senha do usuário';
COMMENT ON COLUMN users.email_verified IS 'Indica se o email foi verificado';
COMMENT ON COLUMN users.phone_verified IS 'Indica se o telefone foi verificado';
COMMENT ON COLUMN users.is_active IS 'Indica se o usuário está ativo no sistema';

-- 12. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 13. Trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
