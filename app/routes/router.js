var express = require("express");
var router = express.Router();


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

router.get("/singup", function (req, res) {
    res.render("pages/singup", {"erros":null, "valores":{"email":"","senha":""},"retorno":null });
});

router.post(
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
);

router.get('/cadastro_inicial', function(req,res){
    res.render('pages/cadastro_inicial', { "erros": null, "valores": {"nome":"","cpf":"","data":"",},"retorno":null });  
})

  router.post(
    "/cadastro_inicial_validacao",
    body("nome").isLength({min:3,max:30}).withMessage("Insira um nome válido."),
    body("cpf")
    .custom((value) => {
        if (validarCPF(value)) {
          return true;
        } else {
          throw new Error('CPF inválido!');
        }
        }),
    body("data")
    .custom((value) => {
      if (isValidDate(value)){
        return true
      } else {
        throw new Error("Data Inválido")
      }
    }),
    function (req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.render("pages/cadastro_inicial", { "erros": errors, "valores":req.body,"retorno":null});
      } else {
  
        return res.render("pages/cadastro_localizacao", { "erros": null, "valores":req.body,"retorno":req.body});
      }
    }
  );

module.exports = router;
