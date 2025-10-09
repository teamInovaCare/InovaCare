var express = require("express");
const moment = require('moment')
var routerProf = express.Router();
const { body, validationResult } = require("express-validator");
var { validarCPF, isValidDate, isMaiorDeIdade, validarCEP, validarConselho, validarUf, limparValorReais } = require("../helpers/validacoes");


/*autenticação*/
const { verificarUsuAutenticado, limparSessao, gravarUsuAutenticado, verificarUsuAutorizado } = require("../model/autenticador_middleware");

/**Requisição da Controller */

const profissionalController = require("../controllers/profissionalController");



/* Home Profissional sem login */

routerProf.get("/homeprofs", function (req, res) {
    res.render("pages/homeprofs.ejs");
});

/* Home Profissional LOGADO */

routerProf.get("/logado-user-prof", verificarUsuAutenticado, function (req, res) {
    res.render("pages/logado-user-prof.ejs", {autenticado: req.session.autenticado, login:req.session.logado,});
});




/**Login do profissional */
/**GET */
routerProf.get("/login-prof", function (req, res) {//login do profissional-
    res.render("pages/login-prof.ejs", {listaErros:null, dadosNotificacao:null,valores:{email:"", senha:""}});
});
/**POST */
/**POST */
routerProf.post( "/login-prof",
    profissionalController.validaloginProf,
    gravarUsuAutenticado,
    
    function(req,res){
        profissionalController.logarProf(req,res);
    });





//cadastro do profissional_inicial
/**Get */
routerProf.get("/cad-inicial-prof", function (req, res) {
    res.render("pages/cad-inicial-prof.ejs", {
        erros: null,
        dadosNotificacao:null,
        valores: {nome:"", cpf:"", dt_nasc:""},
    });
});
/**Post */
routerProf.post("/cad-inicial-prof", profissionalController.validaCadInicialProf,
      (req,res)=> {
        profissionalController.cadIncialProf(req,res);

})



//cadastro do prof. especialidade que ele atua
/**GET */
routerProf.get("/cad-especialidade-prof", function (req, res) {
    res.render("pages/cad-especialidade-prof.ejs", {
        erros: null,
        dadosNotificacao:null,
        valores: {rg_prof:""},
    });
});
/**Post */
routerProf.post("/cad-especialidade-prof", profissionalController.validaCadEspecialidade,
      (req,res)=> {
        profissionalController.cadEspecialidade(req,res);

});



//cadastro do profissional- endereço
/**GET */
routerProf.get("/cad-local-prof", function (req, res) {
    res.render("pages/cad-local-prof.ejs", {
        erros: null,
        dadosNotificacao:null,
        valores: {cep: "", complemento: ""},
    });
});
/**POST */
routerProf.post("/cad-local-prof", profissionalController.validaCadLocalProf,
      (req,res)=> {
        profissionalController.cadLocalProf(req,res);

});



//cadastro do profissional-email e senha
/**GET */
routerProf.get("/cad-dados-prof", function (req, res) {
    res.render("pages/cad-dados-prof.ejs", {
        erros: null,
        dadosNotificacao:null,
        valores: {email: "", confirmaemail: "", senha:"", confirmasenha: ""},
    });
});
/**POST */
routerProf.post("/cad-dados-prof", profissionalController.validaCadDadosProf,
      (req,res)=> {
        profissionalController.cadDadosProf(req,res);

});




/**CONFIGURAÇÃOD E AGENDA DO PROFISSIONAL */

routerProf.get("/config_agenda_prof",
   
    verificarUsuAutenticado,
   verificarUsuAutorizado([2], "pages/restrito"),
    function (req, res) {//cadastro do profissional-email e senha
    res.render("pages/config_agenda_prof.ejs", {autenticado: req.session.autenticado, login: req.session.logado });
});
/**
 * POST */
routerProf.post("/config-agenda-prof", profissionalController.validaAgendaInsert,
      (req,res)=> {
        profissionalController.criarAgenda(req,res);

});





/**VISUALIZAÇÃO DA AGENDA DO PROFISISONAL */

routerProf.get("/home_agenda_prof",

    verificarUsuAutenticado,
   verificarUsuAutorizado([2], "pages/restrito"),
    function (req, res) {//cadastro do profissional-email e senha
    res.render("pages/home_agenda_prof.ejs",
        
        {moment: moment, autenticado: req.session.autenticado, login: req.session.logado , agendas: [], semanadia:""});
});
routerProf.post("/filtroAgenda", (req,res)=>{
    profissionalController.findAgendaProf(req,res);
})




/**PRONTUÁRIOS */

routerProf.get("/prontuario", function (req, res) {//prontuario profissional
    res.render("pages/prontuario.ejs");
});

routerProf.get("/prontugeral", function (req, res) {//prontuario profissional
    res.render("pages/prontugeral.ejs");
});









module.exports = routerProf;
