var express = require("express");
var router = express.Router();
const { body, validationResult } = require("express-validator")
var  {validarCPF, validarCEP, validarConselho, validarUf, converterParaMysql,
    isValidDate,
    isMaiorDeIdade} = require("../helpers/validacoes");


/*autenticação*/
const { verificarUsuAutenticado, limparSessao, gravarUsuAutenticado, verificarUsuAutorizado } = require("../model/autenticador_middleware");

const usuarioController = require("../controllers/usuarioController");


router.get("/", function (req, res) {/**página inicial */
    res.render("pages/index", { autenticado: req.session.autenticado || false, login: req.session.logado || 0 })
});

router.get("/logado-user-pac", function (req, res) {/**página logado */
    res.render("pages/logado-user-pac.ejs", { autenticado: req.session.autenticado || false, login: req.session.logado || 0 })
});


/*autenticação- usuário está logado? Função do Middle*/
router.get("/index", verificarUsuAutenticado, function (req, res) {/*usuário logado*/
    res.render("pages/index", { autenticado: req.session.autenticado, login: req.session.logado, });
});




router.get("/especialidades", function (req, res) {/**listagem das especialidades - botão agendamento */
    res.render("pages/especialidades.ejs")
});

router.get("/cg", function (req, res) {/**Clínico geral */
    res.render("pages/cg.ejs")
});

router.get("/consultas", function (req, res) {/**Minhas consultas */
    res.render("pages/consultas.ejs")
});


router.get("/perfil", function (req, res) {//perfil do paciente
    res.render("pages/perfil.ejs");
});

router.get("/agenda", function (req, res) {
    res.render("pages/agenda.ejs");
});

router.get("/agenda-online", function (req, res) {
    res.render("pages/agenda-online.ejs");
});

router.get("/agenda-domiciliar", function (req, res) {
    res.render("pages/agenda-domiciliar.ejs");
});




/*LOGIN ADM*/ 
router.get("/login-adm", function (req, res) {
    res.render("pages/login-adm.ejs");
});

/*LOGIN pac*/ 
router.get("/login-pac", function (req, res) {
    res.render("pages/login-pac.ejs");
});



// cadastro inicial do paciente
/**GET */
router.get('/cad-inicial-pac', function (req, res) {
    res.render("pages/cad-inicial-pac.ejs");
})
/**Post */
router.post("/cad-inicial-pac", usuarioController.validaCadInicial,
      (req,res)=> {
        usuarioController.cadIncialPac(req,res);

});



//cadastro endereço do paciente -- 
/**GET */
router.get("/cad-local-pac", function (req, res) {
    res.render("pages/cad-local-pac.ejs");
});
/**Post */
router.post("/cad-local-pac", usuarioController.validaCadLocal,
      (req,res)=> {
        usuarioController.cadLocalPac(req,res);

});



//cad_paciente_email e senha_get
/**GET */
router.get("/cad-dados-pac", function (req, res) {
    res.render("pages/cad-dados-pac.ejs");
})
/**Post */
router.post("/cad-dados-pac", usuarioController.validaCadDados,
      (req,res)=> {
        usuarioController.cadDadosPac(req,res);

});




module.exports = router;
