require('dotenv').config();
const pool = require('./config/pool_conection');

async function verificarColunas() {
    try {
        const [resultado] = await pool.query("DESCRIBE usuarios");
        console.log("Colunas da tabela usuarios:");
        resultado.forEach(coluna => {
            console.log(`- ${coluna.Field} (${coluna.Type})`);
        });
        
        const temEmailVerificado = resultado.some(col => col.Field === 'email_verificado');
        const temTokenVerificacao = resultado.some(col => col.Field === 'token_verificacao');
        const temTokenExpiracao = resultado.some(col => col.Field === 'token_expiracao');
        
        console.log('\nVerificação:');
        console.log('email_verificado:', temEmailVerificado ? '✅' : '❌');
        console.log('token_verificacao:', temTokenVerificacao ? '✅' : '❌');
        console.log('token_expiracao:', temTokenExpiracao ? '✅' : '❌');
        
        if (!temEmailVerificado || !temTokenVerificacao || !temTokenExpiracao) {
            console.log('\n🔧 Execute este SQL:');
            console.log('ALTER TABLE usuarios ADD COLUMN email_verificado BOOLEAN DEFAULT FALSE, ADD COLUMN token_verificacao VARCHAR(255), ADD COLUMN token_expiracao DATETIME;');
        }
        
    } catch (error) {
        console.error('Erro:', error.message);
    }
    process.exit();
}

verificarColunas();