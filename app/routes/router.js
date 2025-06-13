var express = require("express");
var router = express.Router();
const { body, validationResult} = require("express-validator")
var {validarCPF, isValidDate, validarCEP} = require
("../helpers/validacoes");
const usuarioController = require("../controllers/usuarioController");


router.get("/", function (req, res) {
    res.render("pages/newuser")
});
 
router.get("/especialidades", function (req, res) {
    res.render("pages/especialidades.ejs")
});

router.get("/cg", function (req, res) {
    res.render("pages/cg.ejs")
});

router.get("/consultas", function (req, res) {
    res.render("pages/consultas.ejs")
});

router.get("/index", function (req, res) {
    res.render("pages/index.ejs")
});

router.get("/homepro", function (req, res) {//home do profissional
    res.render("pages/homepro.ejs");
});

router.get("/cadastro_prof", function (req, res) {//cadastro do profissional
    res.render("pages/cadastro_prof.ejs");
});

router.get("/login_prof", function (req, res) {//login do profissional
    res.render("pages/login_prof.ejs");
});



router.get("/perfil", function (req, res) {
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


router.get("/singup", function (req, res) {
    res.render("pages/singup", {"erros":null, "valores":{"email":"","senha":""},"retorno":null });
});

/*router.post(
    "/singup_post",
    body("email").isEmail().withMessage("Email inválido."),
    body("senha").isStrongPassword().withMessage("Senha muito fraca!"),
    function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.render("pages/singup", { "erros": errors, "valores":req.body,"retorno":null});
    }
        return res.render("pages/index", { "erros": null, "valores":req.body,"retorno":req.body});
    }
);*/

router.post("/singup_post", usuarioController.validalogin, 
    (req,res)=>{
        usuarioController.login(req,res);
    }
)

router.get('/cadastro_inicial', function(req,res){
    res.render('pages/cadastro_inicial', { "erros": null, "valores": {"nome":"","cpf":"","data":"",},"retorno":null });  
})


router.post("/cadastro_inicial_validacao", usuarioController.validacaduser, 
    (req,res)=>{
        usuarioController.cadastroinicial(req,res);
    }
)


router.get("/cadastro_localizacao", function(req,res){
    res.render('pages/cadastro_localizacao', { "erros": null, "valores": {"cep":"", "uf":"", "endereco":"", "bairro":"", "cidade":""},"retorno":null });  
})

router.post("/cadastro_localizacao_validacao", usuarioController.validacadlocal,
    (req,res) => {
        usuarioController.cadastrolocal(req,res);
    }
)


router.get("/cadastro_dados", function(req,res){
  res.render('pages/cadastro_dados', { "erros": null, "valores": {"email":"","senha":"","repsenha":"", "repemail":""},"retorno":null });  
})

router.post("/cadastro_dados_validacao", usuarioController.validacadfinal,
    (req,res) =>{
        usuarioController.cadastrofinal(req,res);
    }
)




module.exports = router;
