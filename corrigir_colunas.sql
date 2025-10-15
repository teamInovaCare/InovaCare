-- Remover colunas com nomes errados
ALTER TABLE usuarios DROP COLUMN email_verificadeo;
ALTER TABLE usuarios DROP COLUMN token_verificado;

-- Adicionar colunas com nomes corretos
ALTER TABLE usuarios 
ADD COLUMN email_verificado BOOLEAN DEFAULT FALSE,
ADD COLUMN token_verificacao VARCHAR(255);