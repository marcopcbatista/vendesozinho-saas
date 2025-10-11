-- Adicionar coluna is_active na tabela users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true NOT NULL;

-- Atualizar usu�rios existentes para ativos
UPDATE users SET is_active = true WHERE is_active IS NULL;

-- Criar �ndice para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Coment�rio da coluna
COMMENT ON COLUMN users.is_active IS 'Indica se o usu�rio est� ativo no sistema';
