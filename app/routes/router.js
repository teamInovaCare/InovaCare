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
    res.render("pages/singup.ejs")
});

module.exports = router;