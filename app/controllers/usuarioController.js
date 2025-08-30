const usuarioModel = require("../model/usuarioModel");
const { body, validationResult } = require("express-validator");
var { validarCPF, isValidDate, validarCEP } = require("../helpers/validacoes");
const bcrypt = require('bcryptjs');




const usuarioController = {

  validacaduser: [
    /**validacção cadastro_inicial */
    body("nome").isLength({ min: 3, max: 30 }).withMessage("Insira um nome válido."),
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
        if (isValidDate(value)) {
          return true
        } else {
          throw new Error("Data Inválido")
        }
      }),],



  validacadlocal: [

    /**validação form cadastro_localizacao */
    body("uf").isLength({ min: 2, max: 2 }).withMessage("UF inválido."),
    body("endereco").isLength({ min: 2, max: 100 }).withMessage("Endereço inválido."),
    body("bairro").isLength({ min: 2, max: 100 }).withMessage("Bairro inválido."),
    body("cidade").isLength({ min: 2, max: 100 }).withMessage("Cidade inválido."),
    body("cep")
      .custom((value) => {
        if (validarCEP(value)) {
          return true
        } else {
          throw new Error("Cep Inválido")
        }
      }),],



  validacadfinal: [

    /**Validação form cadastro_dados */
    body("senha").isStrongPassword().withMessage("Senha muito fraca!"),

    body("repsenha").custom((value, { req }) => {
      return value === req.body.senha;
    }).withMessage("Senhas estão diferentes"),

    body("repemail").custom((value, { req }) => {
      return value === req.body.email;
    }).withMessage("Emails estão diferentes"),

  ],

  /**Variáveis de sessão 1  nome, cpf, dt_nasc-  */
  cadastroinicial: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.render("pages/cadastro_inicial", { "erros": errors, "valores": req.body, "retorno": null });
    } else {

      req.session.dadoUsuario = {
        "nome_usuario": req.body.nome,
        "cpf_usuario": req.body.cpf,
        "dt_nasc_paciente": req.body.data
      }/**Armazena dados da etapa1 */

      return res.render("pages/cadastro_localizacao", { "erros": null, "valores": req.body, "retorno": req.body });
    }
  },


  /**Variáveis de sessão 2 endereço --- Utiliza o ViaCep-  */
  cadastrolocal: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.render("pages/cadastro_localizacao", { "erros": errors, "valores": req.body, "retorno": null });
    } else {

      req.session.dadoUsuario = {
        ...req.session.dadoUsuario,
        "logradouro_paciente": req.body.endereco,
        "bairro_paciente": req.body.bairro,
        "cidade_paciente": req.body.cidade,
        "uf_paciente": req.body.uf,
        "cep": req.body.cep,
      };


      return res.render("pages/cadastro_dados", { "erros": null, "valores": req.body, "retorno": req.body });
    }
  },

  /**Variáveis de sessão 3- email e  senha 
   * Requisição do model para INSERÇÃO DEFINITIVA NO BANCO
  */

  cadastrofinal: async (req, res) => {
    const errors = validationResult(req);

    // 1. Validação da etapa atual
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.render("pages/cadastro_dados", { "erros": errors, "valores": req.body, "retorno": null });

    } else {

      /**CRIPTOGRAFIA DA SENHA */
      const salt = await bcrypt.genSalt(10);
      const senhaCriptografada = await bcrypt.hash(req.body.senha, salt);

      const dadosFormulario = {
        ...req.session.dadoUsuario,
        "email_usuario": req.body.email,
        "senha_usuario": senhaCriptografada
      };

      try {
        let resultInsert = await usuarioModel.create(dadosFormulario);
        if (resultInsert) {
          console.log(resultInsert);
          res.render("pages/index");
        } else {
          res.render("pages/cadastro_dados", { "erros": errors, "valores": req.body, "retorno": null })
        }

      } catch (errors) {
        console.log("Erro no cadastro" + errors);
        return false

      }

    }

  },

  /**VALIDAÇÃO DO LOGIN */


  validalogin: [
    body("email").isEmail().withMessage("Email inválido."),
    body("senha").isStrongPassword().withMessage("Senha inválida!"),

  ],



  logar: async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {

      return res.render("pages/cadastro_inicial", { "erros": erros, "valores": req.body, "retorno": null })
    }
    if (req.session.autenticado.autenticado != null) {
      console.log(req.session.autenticado)
      res.render("pages/index");

    } else {
      res.render("pages/cadastro_inicial", { "erros": erros, "valores": req.body, "retorno": null})
    }
  },
};






module.exports = usuarioController;



