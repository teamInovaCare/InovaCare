var express = require("express");
var router = express.Router();
const { body, validationResult} = require("express-validator")
var {validarCPF, isValidDate, validarCEP} = require
("../helpers/validacoes");


/*autenticação*/ 
const { verificarUsuAutenticado, limparSessao, gravarUsuAutenticado, verificarUsuAutorizado } = require("../model/autenticador_middleware");

const usuarioController = require("../controllers/usuarioController");


router.get("/", function (req, res) {/**página inicial */
    res.render("pages/index", {autenticado: req.session.autenticado || false, login: req.session.logado || 0})
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


/*autenticação- usuário está logado? Função do Middle*/ 
router.get("/index", verificarUsuAutenticado, function (req, res) {/*usuário logado*/ 
  res.render("pages/index", {autenticado: req.session.autenticado, login: req.session.logado,} );
});

router.get("/homepro", function (req, res) {//home do profissional
    res.render("pages/homepro.ejs");
});

router.get("/cadastro_prof", function (req, res) {//cadastro do profissional- versão antiga
    res.render("pages/cadastro_prof.ejs");
});

router.get("/cadprof_inicial", function (req, res) {//cadastro do profissional_inicial
    res.render("pages/cadprof_inicial.ejs");
});

router.get("/cadprof_especialista", function (req, res) {//cadastro do profissional- especialidade 
    res.render("pages/cadprof_especialista.ejs");
});

router.get("/cadprof_local", function (req, res) {//cadastro do profissional- endereço
    res.render("pages/cadprof_local.ejs");
});

router.get("/cadprof_dados", function (req, res) {//cadastro do profissional-email e senha
    res.render("pages/cadprof_dados.ejs");
});



router.get("/login_prof", function (req, res) {//login do profissional-
    res.render("pages/login_prof.ejs");
});



router.get("/perfil", function (req, res) {//perfil do paciente
  res.render("pages/perfil.ejs");
});

router.get("/teste", function (req, res) {
  res.render("pages/teste.ejs");
});

router.get("/prontuario", function (req, res) {//prontuario profissional
  res.render("pages/prontuario.ejs");
});

router.get("/prontugeral", function (req, res) {//prontuario profissional
  res.render("pages/prontugeral.ejs");
});


/**Validação do login, autenticação e "cartão de visita do usuário" */
router.post(
  "/singup_post",
  usuarioController.validalogin,
  gravarUsuAutenticado,
  function (req, res) {
    usuarioController.logar(req, res);
  });

router.get('/cadastro_inicial', function(req,res){// cadastro inicial do paciente- GET
    res.render('pages/cadastro_inicial', { "erros": null, "valores": {"nome":"","cpf":"","data":"",},"retorno":null });  
})


router.post("/cadastro_inicial_validacao", usuarioController.validacaduser, //cadastro incial -post
    (req,res)=>{
        usuarioController.cadastroinicial(req,res);
    }
)


router.get("/cadastro_localizacao", function(req,res){//cadastro endereço do paciente -- 
    res.render('pages/cadastro_localizacao', { "erros": null, "valores": {"cep":"", "uf":"", "endereco":"", "bairro":"", "cidade":""},"retorno":null });  
})

router.post("/cadastro_localizacao_validacao", usuarioController.validacadlocal,//post cad_paciente_endereço
    (req,res) => {
        usuarioController.cadastrolocal(req,res);
    }
)


router.get("/cadastro_dados", function(req,res){//cad_paciente_email e senha_get
  res.render('pages/cadastro_dados', { "erros": null, "valores": {"email":"","senha":"","repsenha":"", "repemail":""},"retorno":null });  
})

router.post("/cadastro_dados_validacao", usuarioController.validacadfinal,//cad_paciente_post_email e senha
    (req,res) =>{
        usuarioController.cadastrofinal(req,res);
    }
)




module.exports = router;
