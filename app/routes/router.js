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
    res.render("pages/index")
});

// , { autenticado: req.session.autenticado || false, login: req.session.logado || 0 }



/**página logado */
router.get("/logado-user-pac", verificarUsuAutenticado, function (req, res) {
        res.render("pages/logado-user-pac.ejs", {autenticado: req.session.autenticado, login: req.session.logado, } );
});




/*autenticação- usuário está logado? Função do Middle*/
router.get("/index", /*verificarUsuAutenticado,*/ function (req, res) {/*usuário logado*/
    res.render("pages/index");
});

// , { autenticado: req.session.autenticado, login: req.session.logado, }




router.get("/especialidades", function (req, res) {/**listagem das especialidades - botão agendamento */
    res.render("pages/especialidades.ejs")
});


router.get("/cg", function (req, res) {/**Clínico geral */
    res.render("pages/cg.ejs", {
        medicos: []})
});
/**POST */
router.post("/filtro-medicos", (req,res)=>{
    usuarioController.filtroMedicos(req,res);
})



/*router.get('/agenda-online', (req, res) => {
const { idEspecialista, tipoAtendimento } = req.query;
  console.log(idEspecialista, tipoAtendimento);
  res.render("pages/agenda-online.ejs", usuarioController.GerarProximosDias)
  
});*/

router.get('/agenda-online', usuarioController.GerarProximosDias);
router.get('/agenda-domiciliar', usuarioController.GerarProximosDias);

/*router.get('/agenda-domiciliar', (req, res) => {
  const { tipo_atendimento, id_especialista } = req.query;
  console.log(tipo_atendimento, id_especialista);
  res.render("pages/agenda-domiciliar.ejs")
  // lógica para buscar os dados no banco
});*/



router.get("/consultas", function (req, res) {/**Minhas consultas */
    res.render("pages/consultas.ejs")
});


// Usar as rotas do perfil
const perfilRoutes = require('./perfil');
router.use('/perfil', perfilRoutes);

// Manter compatibilidade com rota antiga
router.get("/perfil", function (req, res) {
    res.redirect('/perfil/');
});

router.get("/agenda", function (req, res) {
    res.render("pages/agenda.ejs");
});



router.get("/agenda-domiciliar", function (req, res) {
    res.render("pages/agenda-domiciliar.ejs");
});




/*LOGIN ADM*/ 
router.get("/login-adm", function (req, res) {
    res.render("pages/login-adm.ejs");
});


router.get("adm-teste", 
    verificarUsuAutorizado([3, 3], "pages/restrito"),
    function (req,res){
    res.render("pages/adm-teste", req.session.autenticado);
})





/*LOGIN PACIENTE*/ 
/**GET */
router.get("/login-pac", function (req, res) {
    res.render("pages/login-pac.ejs", {listaErros: null,  dadosNotificacao:null, valores:{email: "", senha:""}});
        
});

/**POST */
router.post( "/login-pac",
    usuarioController.validalogin,
    gravarUsuAutenticado,
    
    function(req,res){
        usuarioController.logarPac(req,res);
    });





// cadastro inicial do paciente
/**GET */
router.get('/cad-inicial-pac', function (req, res) {
    res.render("pages/cad-inicial-pac.ejs", {
        erros: null,
        dadosNotificacao:null,
        valores: {nome: "", cpf: "", dt_nasc:""},
    });
})
/**Post */
router.post("/cad-inicial-pac", usuarioController.validaCadInicial,
       (req,res)=> {
        usuarioController.cadIncialPac(req,res);

});



//cadastro endereço do paciente -- 
/**GET */
router.get("/cad-local-pac", function (req, res) {
    res.render("pages/cad-local-pac.ejs", {
        erros: null,
        dadosNotificacao:null,
        valores: {cep: "", complemento: ""},
    });
});
/**Post */
router.post("/cad-local-pac", usuarioController.validaCadLocal,
      (req,res)=> {
        usuarioController.cadLocalPac(req,res);

});



//cad_paciente_email e senha_get
/**GET */
router.get("/cad-dados-pac", function (req, res) {
    res.render("pages/cad-dados-pac.ejs", {
        erros: null,
        dadosNotificacao:null,
        valores: {email: "", confirmaemail: "", senha:"", confirmasenha: ""},
    });
});
/**Post */
router.post("/cad-dados-pac", usuarioController.validaCadDados,
      (req,res)=> {
        usuarioController.cadDadosPac(req,res);

});


/**Página quem somos*/
router.get("/quem-somos", function (req, res) {
    res.render("pages/quem-somos.ejs");
});

router.get("/perfildoprof", function (req, res) {
    res.render("pages/perfildoprof.ejs");
});

/**Rota de logout */
router.get("/sair", limparSessao, function (req, res) {
    res.redirect("/");
});


module.exports = router;


