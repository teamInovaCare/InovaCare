const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

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
// IMPORT DAS ROTAS EXISTENTES
// =============================
const rotas = require("./app/routes/router");
const rotasProf = require("./app/routes/routerProf");
const rotasAdm = require("./app/routes/routerAdm");
const perfilRoutes = require("./app/routes/perfil");
const mercadoPagoRoutes = require("./app/routes/mercadoPagoRoutes");

app.use("/", rotas);
app.use("/perfil", perfilRoutes);
app.use("/profissional", rotasProf);
app.use("/adm", rotasAdm);
app.use("/", mercadoPagoRoutes);

// =============================
// CONFIGURAÇÃO DE UPLOAD E PDF
// =============================
const pdfsPath = path.join(__dirname, 'app', 'public', 'pdfs');
if (!fs.existsSync(pdfsPath)) fs.mkdirSync(pdfsPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, pdfsPath),
  filename: (req, file, cb) => cb(null, `${file.fieldname}_${Date.now()}.pdf`)
});

const upload = multer({ storage });

// Função para gerar PDF
const gerarPDF = (nome, data, profissional, avaliacao, tipo) => {
  const doc = new PDFDocument();
  const filePath = path.join(pdfsPath, `${tipo}_${Date.now()}.pdf`);
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  doc.fontSize(18).text(`${tipo.toUpperCase()}`, { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(`Nome do Paciente: ${nome}`);
  doc.text(`Data: ${data}`);
  doc.text(`Profissional: ${profissional}`);
  doc.moveDown();
  doc.fontSize(12).text(`${tipo} Detalhes:`);
  doc.fontSize(12).text(avaliacao, { align: "justify" });
  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve(filePath));
    writeStream.on("error", reject);
  });
};

// =============================
// ROTAS INLINE PARA PDF
// =============================

// Prontuário
app.post('/upload-prontuario', upload.single('pdf'), async (req, res) => {
  try {
    const { nome, data, profissional, avaliacao } = req.body;
    const pdfPath = await gerarPDF(nome, data, profissional, avaliacao, "Prontuário");
    console.log("PDF de prontuário gerado em:", pdfPath);
    res.json({ success: true, message: "Prontuário gerado!", path: pdfPath });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Erro ao gerar PDF." });
  }
});

// Receita
app.post('/upload-receita', upload.single('pdf'), async (req, res) => {
  try {
    const { nome, data, profissional, avaliacao } = req.body;
    const pdfPath = await gerarPDF(nome, data, profissional, avaliacao, "Receita");
    console.log("PDF de receita gerado em:", pdfPath);
    res.json({ success: true, message: "Receita gerada!", path: pdfPath });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Erro ao gerar PDF." });
  }
});

// Exame
app.post('/upload-exame', upload.single('pdf'), async (req, res) => {
  try {
    const { nome, data, profissional, avaliacao } = req.body;
    const pdfPath = await gerarPDF(nome, data, profissional, avaliacao, "Exame");
    console.log("PDF de exame gerado em:", pdfPath);
    res.json({ success: true, message: "Exame gerado!", path: pdfPath });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Erro ao gerar PDF." });
  }
});

// =============================
// SERVIDOR
// =============================
app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
  console.log(`➡ http://localhost:${port}`);
});
