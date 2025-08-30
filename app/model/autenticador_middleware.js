const { validationResult } = require("express-validator");
const usuarioModel = require("./usuarioModel");
const bcrypt = require("bcryptjs");

const verificarUsuAutenticado = (req, res, next) => {
    let autenticado;

    if (req.session.autenticado) {
        autenticado = req.session.autenticado;
        req.session.logado = (req.session.logado || 0) + 1;

    } else {
         autenticado = { autenticado: null, id: null, tipo: null };
         req.session.logado = 0;
    };
    
    req.session.autenticado = autenticado;
    next();
};

const limparSessao = (req, res, next) => {
    req.session.destroy();
    next()
}

const gravarUsuAutenticado = async (req, res, next) => {
     autenticado =  { autenticado: null, id: null, tipo: null };
    erros = validationResult(req)

    if (erros.isEmpty()) {
        var dadosForm = {
            email_usuario: req.body.email,
            senha_usuario: req.body.senha
        };

        try{
            const results = await usuarioModel.findUserEmail(dadosForm);
            const total = results.length;

            if (total === 1) {
                // Verifica se a senha está correta
                if (bcrypt.compareSync(dadosForm.senha_usuario, results[0].senha_usuario)) {
                    autenticado = {
                        autenticado: results[0].nome_usuario,
                        id: results[0].id_usuario,
                        tipo: results[0].tipo_usuario
                    };
                }
            }
        } catch (erros) {
            console.error("Erro na autenticação:", erros);
            autenticado = null;
        }
    }

    req.session.autenticado = autenticado;
    req.session.logado = 0;
    
    next();
};


const verificarUsuAutorizado = (tipoPermitido, destinoFalha) => {
    return (req, res, next) => {
        const usuarioAutenticado = req.session.autenticado;
        
        if (usuarioAutenticado && 
            usuarioAutenticado.autenticado !== null && 
            tipoPermitido.includes(usuarioAutenticado.tipo)) {
            next();
        } else {
            res.render(destinoFalha, usuarioAutenticado);
        }
    };
};

module.exports = {
    verificarUsuAutenticado,
    limparSessao,
    gravarUsuAutenticado,
    verificarUsuAutorizado
};
