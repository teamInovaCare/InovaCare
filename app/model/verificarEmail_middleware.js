const usuarioModel = require('./usuarioModel');

const verificarEmailVerificado = async (req, res, next) => {
    if (req.session.autenticado && req.session.autenticado.id) {
        const emailVerificado = await usuarioModel.isEmailVerificado(req.session.autenticado.id);
        
        if (!emailVerificado) {
            return res.render('pages/email-nao-verificado', {
                listaErros: null,
                dadosNotificacao: {
                    titulo: "Email não verificado!",
                    mensagem: "Verifique seu email para acessar esta página.",
                    tipo: "warning"
                },
                email: req.session.autenticado.email || '',
                nome: req.session.autenticado.autenticado || '',
                valores: {}
            });
        }
    }
    
    next();
};

module.exports = { verificarEmailVerificado };