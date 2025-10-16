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
   
    // Limpar sessões anteriores
    req.session.emailNaoVerificado = null;
    
    console.log('=== DEBUG LOGIN ===');
    console.log('Email digitado:', req.body.email);
    
    if (erros.isEmpty()) {
        const dadosForm = {
            email_usuario: req.body.email,
            senha_usuario: req.body.senha,
        };
        
        var results = await usuarioModel.findUserEmail(dadosForm);
        var total = Object.keys(results).length;
        console.log('Total de usuários encontrados:', total);
        console.log('Resultado da busca:', results[0]);

        if(total == 1){
            console.log('Comparando senhas...');
            if(bcrypt.compareSync(dadosForm.senha_usuario, results[0].senha_usuario)){
                console.log('Senha correta!');
                // Verificar se o email foi verificado
                if (results[0].email_verificado == 0 || results[0].email_verificado === false) {
                    console.log('Email não verificado para:', results[0].nome_usuario);
                    // Limpar sessão anterior
                    req.session.emailNaoVerificado = null;
                    // Definir nova sessão com dados corretos
                    req.session.emailNaoVerificado = {
                        email: results[0].email_usuario,
                        nome: results[0].nome_usuario,
                        tipo: parseInt(results[0].tipo_usuario)
                    };
                    console.log('Dados armazenados na sessão:', req.session.emailNaoVerificado);
                    var autenticado = { autenticado: null, id: null, tipo: null };
                } else {
                    console.log('Email verificado, criando sessão');
                    // Limpar sessão de email não verificado se existir
                    req.session.emailNaoVerificado = null;
                    var autenticado={
                        autenticado: results[0].nome_usuario,
                        id: results[0].id_usuario,
                        tipo: parseInt(results[0].tipo_usuario),
                    };
                }
                console.log('Usuário autenticado:', autenticado);
            } else {
                console.log('Senha incorreta');
            }
        } else {
            console.log('Usuário não encontrado ou múltiplos usuários');
        }
        
    } else {
        console.log('Erros de validação:', erros.array());
    }
    req.session.autenticado = autenticado;
    req.session.logado = 0;
    console.log('=== FIM DEBUG LOGIN ===');
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