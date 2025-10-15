const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = 3000;

// =============================
// CONFIGURAÇÃO DE SESSÃO
// =============================
app.use(session({
  secret: process.env.session_secret || "inovacare_secret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// =============================
// CONFIGURAÇÕES DO EXPRESS
// =============================
app.use(express.static("app/public"));
app.set("view engine", "ejs");
app.set("views", "./app/views");
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =============================
// IMPORT DAS ROTAS
// =============================
const rotas = require("./app/routes/router");
const rotasProf = require("./app/routes/routerProf");
const rotasAdm = require("./app/routes/routerAdm");
const perfilRoutes = require("./app/routes/perfil");
const mercadoPagoRoutes = require("./app/routes/mercadoPagoRoutes"); // <-- Adiciona isso

// =============================
// USO DAS ROTAS
// =============================
app.use("/", rotas);
app.use("/perfil", perfilRoutes);
app.use("/profissional", rotasProf);
app.use("/adm", rotasAdm);
app.use("/", mercadoPagoRoutes); // <-- Ativa o Mercado Pago

// =============================
// SERVIDOR
// =============================
app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
  console.log(`➡ http://localhost:${port}`);
});
