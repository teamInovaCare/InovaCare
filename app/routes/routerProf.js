var express = require("express");
var routerProf = express.Router();
const { body, validationResult } = require("express-validator");
var { validarCPF, isValidDate, isMaiorDeIdade, validarCEP, validarConselho, validarUf } = require("../helpers/validacoes");


/*autenticação*/
const { verificarUsuAutenticado, limparSessao, gravarUsuAutenticado, verificarUsuAutorizado } = require("../model/autenticador_middleware");

/**Requisição da Controller */

const profissionalController = require("../controllers/profissionalController");





/**Login do profissional */
/**GET */
routerProf.get("/login-prof", function (req, res) {//login do profissional-
    res.render("pages/login-prof.ejs");
});



//cadastro do profissional_inicial
/**Get */
routerProf.get("/cad-inicial-prof", function (req, res) {
    res.render("pages/cad-inicial-prof.ejs");
});
/**Post */
routerProf.post("/cad-inicial-prof", profissionalController.validaCadInicialProf,
      (req,res)=> {
        profissionalController.cadIncialProf(req,res);

})



//cadastro do prof. especialidade que ele atua
/**GET */
routerProf.get("/cad-especialidade-prof", function (req, res) {
    res.render("pages/cad-especialidade-prof.ejs");
});
/**Post */
routerProf.post("/cad-especialidade-prof", profissionalController.validaCadEspecialidade,
      (req,res)=> {
        profissionalController.cadEspecialidade(req,res);

});



//cadastro do profissional- endereço
/**GET */
routerProf.get("/cad-local-prof", function (req, res) {
    res.render("pages/cad-local-prof.ejs");
});
/**POST */
routerProf.post("/cad-local-prof", profissionalController.validaCadLocalProf,
      (req,res)=> {
        profissionalController.cadLocalProf(req,res);

});



//cadastro do profissional-email e senha
/**GET */
routerProf.get("/cad-dados-prof", function (req, res) {
    res.render("pages/cad-dados-prof.ejs");
});
/**POST */
routerProf.post("/cad-dados-prof", profissionalController.validaCadDadosProf,
      (req,res)=> {
        profissionalController.cadDadosProf(req,res);

});





/**CONFIGURAÇÃOD E AGENDA DO PROFISSIONAL */

routerProf.get("/config_agenda_prof", function (req, res) {//cadastro do profissional-email e senha
    res.render("pages/config_agenda_prof.ejs");
});

/**VISUALIZAÇÃO DA AGENDA DO PROFISISONAL */

routerProf.get("/home_agenda_prof", function (req, res) {//cadastro do profissional-email e senha
    res.render("pages/home_agenda_prof.ejs");
});






/**PRONTUÁRIOS */

routerProf.get("/prontuario", function (req, res) {//prontuario profissional
    res.render("pages/prontuario.ejs");
});

routerProf.get("/prontugeral", function (req, res) {//prontuario profissional
    res.render("pages/prontugeral.ejs");
});




/* Home Profissional sem login */

routerProf.get("/homeprofs", function (req, res) {
    res.render("pages/homeprofs.ejs");
});





module.exports = routerProf;
