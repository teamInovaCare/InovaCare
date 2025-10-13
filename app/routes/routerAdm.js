var express = require("express");
var routerAdm = express.Router();
const { body, validationResult } = require("express-validator")
var  {validarCPF, validarCEP, validarConselho, validarUf, converterParaMysql,
    isValidDate,
    isMaiorDeIdade} = require("../helpers/validacoes");



/*autenticação*/
/*const { verificarUsuAutenticado, limparSessao, gravarUsuAutenticado, verificarUsuAutorizado } = require("../model/autenticador_middleware");
*/


routerAdm.get("/adm-avaliacao", function (req, res) {
    res.render("pages/adm-avaliacao.ejs");
});

routerAdm.get("/adm-consultas", function (req, res) {
    res.render("pages/adm-consultas.ejs");
});


routerAdm.get("/adm-financeiro", function (req, res) {
    res.render("pages/adm-financeiro.ejs");
});

routerAdm.get("/adm-gestao-home", function (req, res) {
    res.render("pages/adm-gestao-home.ejs");
});

routerAdm.get("/adm-perfil", function (req, res) {
    res.render("pages/adm-perfil.ejs");
});








module.exports = routerAdm;


