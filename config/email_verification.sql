-- Adicionar colunas para verificação de email
ALTER TABLE usuarios 
ADD COLUMN email_verificado BOOLEAN DEFAULT FALSE,
ADD COLUMN token_verificacao VARCHAR(255),
ADD COLUMN token_expiracao DATETIME;