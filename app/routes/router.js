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
        return res.render("pages/home", { "erros": null, "valores":req.body,"retorno":req.body});
    }
);

module.exports = router;
