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
    res.render("pages/cg.ejs")
});

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

// Rota para criar preferência do Mercado Pago
router.post("/create-preference", async (req, res) => {
    try {
        const { MercadoPagoConfig, Preference } = require('mercadopago');
        const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN });
        const preference = new Preference(client);
        
        const { title, price } = req.body;
        
        const body = {
            items: [{
                id: "consulta-" + Date.now(),
                title: title,
                description: "Consulta médica online",
                unit_price: parseFloat(price),
                quantity: 1,
                currency_id: "BRL"
            }],
            payer: {
                name: "Paciente",
                surname: "InovaCare",
                email: "paciente@inovacare.com"
            },
            back_urls: {
                success: `${process.env.BASE_URL || 'http://localhost:3000'}/consultas`,
                failure: `${process.env.BASE_URL || 'http://localhost:3000'}/agenda-online`,
                pending: `${process.env.BASE_URL || 'http://localhost:3000'}/consultas`
            },
            auto_return: "approved",
            payment_methods: {
                excluded_payment_types: [],
                installments: 12
            }
        };

        const response = await preference.create({ body });
        res.json({ id: response.id });
        
    } catch (error) {
        console.error('Erro MP:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});


module.exports = router;


