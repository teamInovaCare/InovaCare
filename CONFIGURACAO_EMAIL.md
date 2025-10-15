# Configuração de Email para Verificação

## Passos para configurar o email:

### 1. Configurar Gmail (recomendado)
1. Acesse sua conta Gmail
2. Vá em "Gerenciar sua Conta do Google"
3. Na aba "Segurança", ative a "Verificação em duas etapas"
4. Depois, vá em "Senhas de app" e gere uma senha específica para o aplicativo

### 2. Atualizar o arquivo .env
Substitua as configurações no arquivo .env:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app-gerada
EMAIL_FROM=InovaCare <seu-email@gmail.com>
BASE_URL=http://localhost:3000
```

### 3. Executar o script SQL
Execute o arquivo `config/email_verification.sql` no seu banco de dados para adicionar as colunas necessárias:

```sql
ALTER TABLE usuarios 
ADD COLUMN email_verificado BOOLEAN DEFAULT FALSE,
ADD COLUMN token_verificacao VARCHAR(255),
ADD COLUMN token_expiracao DATETIME;
```

### 4. Testar o sistema
1. Faça um novo cadastro
2. Verifique se o email de verificação foi enviado
3. Clique no link do email para verificar
4. Tente fazer login

## Fluxo do Sistema:

1. **Cadastro**: Usuário se cadastra → Email de verificação é enviado → Conta fica pendente
2. **Login sem verificação**: Sistema bloqueia e pede para verificar email
3. **Verificação**: Usuário clica no link → Email é verificado → Pode fazer login
4. **Reenvio**: Se não recebeu, pode solicitar reenvio do email

## Páginas criadas:
- `/app/views/pages/email-enviado.ejs` - Confirmação de envio
- `/app/views/pages/email-nao-verificado.ejs` - Aviso para verificar
- `/app/views/pages/email-verificado.ejs` - Confirmação de verificação
- `/app/views/pages/erro-verificacao.ejs` - Erro na verificação

## Rotas adicionadas:
- `GET /verificar-email?token=xxx` - Verificar email
- `POST /reenviar-email` - Reenviar email de verificação