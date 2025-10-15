const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const emailService = {
    gerarToken: () => {
        return crypto.randomBytes(32).toString('hex');
    },

    enviarEmailVerificacao: async (email, nome, token) => {
        let baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        
        // Detectar se está rodando no GitHub Codespace
        if (process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN) {
            baseUrl = `https://${process.env.CODESPACE_NAME}-3000.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`;
        }
        
        const linkVerificacao = `${baseUrl}/verificar-email?token=${token}`;
        
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Bem-vindo ao InovaCare - Verifique seu email',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verificação de Email - InovaCare</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
                        <tr>
                            <td align="center">
                                <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                    <!-- Header -->
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #109EA6 0%, #109EA6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                                            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">InovaCare</h1>
                                            <p style="color: #e8f0fe; margin: 5px 0 0 0; font-size: 16px;">Cuidando da sua saúde</p>
                                        </td>
                                    </tr>
                                    
                                    <!-- Conteúdo -->
                                    <tr>
                                        <td style="padding: 40px 30px;">
                                            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Olá, ${nome}! </h2>
                                            
                                            <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                                Bem-vindo ao <strong>InovaCare</strong>! Estamos muito felizes em tê-lo conosco.
                                            </p>
                                            
                                            <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                                Para ativar sua conta e começar a usar nossa plataforma, clique no botão abaixo:
                                            </p>
                                            
                                            <!-- Botão de verificação -->
                                            <div style="text-align: center; margin: 30px 0;">
                                                <a href="${linkVerificacao}" style="
                                                    background: linear-gradient(135deg, #109EA6 0%, #109EA6 100%);
                                                    color: white;
                                                    padding: 15px 30px;
                                                    text-decoration: none;
                                                    border-radius: 25px;
                                                    font-size: 16px;
                                                    font-weight: bold;
                                                    display: inline-block;
                                                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                                                    transition: all 0.3s ease;
                                                "> Verificar Email</a>
                                            </div>
                                            
                                            <div style="background-color: #f8f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
                                                <p style="color: #555; font-size: 14px; margin: 0; line-height: 1.5;">
                                                    <strong> Segurança:</strong> Este link expira em 24 horas por questões de segurança.
                                                </p>
                                            </div>
                                            
                                            <p style="color: #999; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0;">
                                                Se você não se cadastrou no InovaCare, pode ignorar este email com segurança.
                                            </p>
                                        </td>
                                    </tr>
                                    
                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color: #f8f9ff; padding: 20px 30px; text-align: center; border-radius: 0 0 10px 10px;">
                                            <p style="color: #999; font-size: 12px; margin: 0; line-height: 1.4;">
                                                © 2024 InovaCare - Plataforma de Saúde Digital<br>
                                                Este é um email automático, não responda.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `
        };

        return await transporter.sendMail(mailOptions);
    },

    enviarEmailRedefinicaoSenha: async (email, nome, token) => {
        let baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        
        // Detectar se está rodando no GitHub Codespace
        if (process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN) {
            baseUrl = `https://${process.env.CODESPACE_NAME}-3000.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`;
        }
        
        const linkRedefinicao = `${baseUrl}/redefinir-senha?token=${token}`;
        
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'InovaCare - Redefinição de Senha',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Redefinição de Senha - InovaCare</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
                        <tr>
                            <td align="center">
                                <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #109EA6 0%, #109EA6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                                            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">InovaCare</h1>
                                            <p style="color: #e8f0fe; margin: 5px 0 0 0; font-size: 16px;">Redefinição de Senha</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 40px 30px;">
                                            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Olá, ${nome}!</h2>
                                            <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                                Recebemos uma solicitação para redefinir a senha da sua conta no <strong>InovaCare</strong>.
                                            </p>
                                            <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                                Para criar uma nova senha, clique no botão abaixo:
                                            </p>
                                            <div style="text-align: center; margin: 30px 0;">
                                                <a href="${linkRedefinicao}" style="
                                                    background: linear-gradient(135deg, #109EA6 0%, #109EA6 100%);
                                                    color: white;
                                                    padding: 15px 30px;
                                                    text-decoration: none;
                                                    border-radius: 25px;
                                                    font-size: 16px;
                                                    font-weight: bold;
                                                    display: inline-block;
                                                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                                                ">Redefinir Senha</a>
                                            </div>
                                            <div style="background-color: #f8f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
                                                <p style="color: #555; font-size: 14px; margin: 0; line-height: 1.5;">
                                                    <strong>Segurança:</strong> Este link expira em 1 hora. Se você não solicitou esta redefinição, ignore este email.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="background-color: #f8f9ff; padding: 20px 30px; text-align: center; border-radius: 0 0 10px 10px;">
                                            <p style="color: #999; font-size: 12px; margin: 0; line-height: 1.4;">
                                                © 2024 InovaCare - Plataforma de Saúde Digital<br>
                                                Este é um email automático, não responda.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `
        };

        return await transporter.sendMail(mailOptions);
    }
};

module.exports = emailService;