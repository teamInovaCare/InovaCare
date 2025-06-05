const express = require("express");
const session = require("express-session");
const app = express();
const port = 3000;
const env = require("dotenv").config();/*add para a conexão com o env*/

app.use(session({
  secret: process.env.session_secret, // troque por algo mais seguro em produção
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // true só se usar HTTPS
}));

app.use(express.static("app/public"));

app.set("view engine", "ejs");
app.set("views", "./app/views");

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


var rotas = require("./app/routes/router");
app.use("/", rotas);



app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}\nhttp://localhost:${port}`);
});
