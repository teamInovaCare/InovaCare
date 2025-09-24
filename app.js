const express = require("express");
const session = require("express-session");
const app = express();
const port = 3000;
require("dotenv").config();

app.use(session({
  secret: process.env.session_secret, // Defina isso no seu .env
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use((req, res, next) => {
    if (req.session.logado === undefined) {
        req.session.logado = 0;
    }
    next();
});

app.use(express.static("app/public"));
app.set("view engine", "ejs");
app.set("views", "./app/views");
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

/**Acesso a Router */
var rotas = require("./app/routes/router");
var rotasProf = require("./app/routes/routerProf");
var perfilRoutes = require("./app/routes/perfil");

/**URLs */
app.use("/", rotas);
app.use("/perfil", perfilRoutes);
app.use("/profissional", rotasProf);

app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}\nhttp://localhost:${port}`);
});