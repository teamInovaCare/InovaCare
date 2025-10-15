const { validationResult } = require("express-validator");
const usuarioModel = require("./usuarioModel"); // 
const bcrypt = require("bcryptjs");

verificarUsuAutenticado = (req, res, next) => {
    if (req.session.autenticado) {
        var autenticado = req.session.autenticado;
        req.session.logado = req.session +1;
    } else {
        var autenticado = { autenticado: null, id: null, tipo: null };
        req.session.logado = 0
    }
    req.session.autenticado = autenticado;
    next();
}

limparSessao = (req, res, next) => {
    req.session.destroy();
    next()
}

gravarUsuAutenticado = async (req, res, next) => {

    erros = validationResult(req);
    var autenticado = { autenticado: null, id: null, tipo: null };
   
    
    if (erros.isEmpty()) {
        const dadosForm = {
            email_usuario: req.body.email,
            senha_usuario: req.body.senha,
        };
        
        var results = await usuarioModel.findUserEmail(dadosForm);
        var total = Object.keys(results).length;
        console.log('Resultado da busca:', results[0]);

        if(total == 1){
            if(bcrypt.compareSync(dadosForm.senha_usuario, results[0].senha_usuario)){
                var autenticado={
                    autenticado: results[0].nome_usuario,
                    id: results[0].id_usuario,
                    tipo: parseInt(results[0].tipo_usuario),
                };
                console.log('Usuário autenticado:', autenticado);
            }
        }
        
    }
    req.session.autenticado = autenticado;
    req.session.logado = 0;
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