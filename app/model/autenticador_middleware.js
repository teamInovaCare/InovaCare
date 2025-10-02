const { validationResult } = require("express-validator");
const usuarioModel = require("./usuarioModel"); // ✅ Nome corrigido
const bcrypt = require("bcryptjs");

verificarUsuAutenticado = (req, res, next) => {
    if (req.session.autenticado) {
        var autenticado = req.session.autenticado;
    } else {
        var autenticado = { autenticado: null, id: null, tipo: null };
    }
    req.session.autenticado = autenticado;
    next();
}

limparSessao = (req, res, next) => {
    req.session.destroy();
    next()
}

gravarUsuAutenticado = async (req, res, next) => {
    let autenticado = { autenticado: null, id: null, tipo: null };
    const erros = validationResult(req);
    
    if (erros.isEmpty()) {
        const dadosForm = {
            email_usuario: req.body.email,
            senha_usuario: req.body.senha,
        };
        
        // if (!dadosForm.senha_usuario) {
        //     req.session.autenticado = autenticado;
        //     return next();
        // }
        
        const results = await usuarioModel.findUserEmail(dadosForm);
        console.log(results[0]);
        
        if (results && results.length > 0) {
            const usuario = results[0];
            const senhaHash = usuario.senha_usuario;
            
            if (senhaHash && bcrypt.compareSync(dadosForm.senha_usuario, senhaHash)) {
                req.session.autenticado = {
                    autenticado: usuario.nome_usuario,
                    id: usuario.id_usuario,
                    tipo: usuario.tipo_usuario
                };
            }
        }
    }
    
    req.session.autenticado = autenticado;
    next();
}



verificarUsuAutorizado = (tipoPermitido, destinoFalha) => {
    return (req, res, next) => {
        if (req.session.autenticado.autenticado != null &&
            tipoPermitido.find(function (element) { return element == req.session.autenticado.tipo }) != undefined) {
            next();
        } else {
            res.render(destinoFalha, req.session.autenticado);
        }
    };
}

module.exports = {
    verificarUsuAutenticado,
    limparSessao,
    gravarUsuAutenticado,
    verificarUsuAutorizado
}