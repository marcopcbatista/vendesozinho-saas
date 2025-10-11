-- Adicionar coluna is_active na tabela users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true NOT NULL;

-- Atualizar usuários existentes para ativos
UPDATE users SET is_active = true WHERE is_active IS NULL;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Comentário da coluna
COMMENT ON COLUMN users.is_active IS 'Indica se o usuário está ativo no sistema';
