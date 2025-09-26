const usuarioModel = require("../model/usuarioModel");
const { body, validationResult } = require("express-validator");
var { validarCPF, validarCEP, converterParaMysql,
  isValidDate,
  isMaiorDeIdade } = require("../helpers/validacoes");
const bcrypt = require('bcryptjs');




const usuarioController = {


  /**Cad-inicial- validações */
  validaCadInicial: [

    /**validacção cadastro_inicial - nome-cpf e data */

    body("nome").isLength({ min: 5, max: 30 }).withMessage("Insira um nome válido."),
    body("cpf")
      .custom((value) => {
        if (validarCPF(value)) {
          return true;
        } else {
          throw new Error('CPF inválido!');
        }
      }),
    body('dt_nasc')
      .custom((value) => {
        // 1. Converter para formato MySQL
        const dataMysql = converterParaMysql(value);

        // 2. Validar se a data existe
        if (!dataMysql || !isValidDate(dataMysql)) {
          throw new Error("Data de nascimento inválida");
        }
        // 3. Validar se é maior de idade
        if (!isMaiorDeIdade(dataMysql)) {
          throw new Error("O usuário deve ser maior de idade");
        }
        return true; // passou nas duas validações
      })
  ],

  /**Armazenamento dos campos */
  cadIncialPac: async (req, res) => {

    /**Erros de validação */
    const errors = validationResult(req);

    /**Se a lista de erros não está vazia */
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.render("pages/cad-inicial-pac", {
        erros: errors,
        dadosNotificacao: {
          titulo: "Erro ao inserir os dados!",
          mensagem: "Verifique os valores digitados!",
          tipo: "error",
        },

        valores: req.body,
      });

    }



    /**Se não tem erros armazena os dados */
    req.session.dadosPac = {
      // "tipo_usuario": tipouser,
      // "status_usuario": statususer,
      "nome_usuario": req.body.nome,
      "cpf_usuario": req.body.cpf,
      "dt_nasc_paciente": req.body.dt_nasc

    }

    /**Renderiza a próxima etapa do cadastro */
    return res.render("pages/cad-local-pac", {
      erros: errors,
      dadosNotificacao: null,

      valores: req.body,
    });

  },


  validaCadLocal: [

    /**validação cad-local-paciente*/

    body("cep")
      .custom((value) => {
        if (validarCEP(value)) {
          return true
        } else {
          throw new Error("Cep Inválido")
        }
      }),
    body("complemento").isLength({ min: 3, max: 100 }).withMessage("Complemento inválido.")

  ],

  cadLocalPac: async (req, res) => {

    /**Erros de validação */
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      /**Se a lista nãoe stiver vazia */
      return res.render("pages/cad-local-pac", {
        erros: errors,
        dadosNotificacao: {
          titulo: "Erro ao inserir os dados!",
          mensagem: "Verifique os valores digitados!",
          tipo: "error",
        },

        valores: req.body,
      });

    }

    /**Armazena os dados se não há erros */
    req.session.dadosPac = {
      /**Recebe o que já tem na variável */
      ...req.session.dadosPac,
      "cep_paciente": req.body.cep,
      "logradouro_paciente": req.body.endereco,
      "bairro_paciente": req.body.bairro,
      "cidade_paciente": req.body.cidade,
      "num_resid_paciente": req.body.numero,
      "uf_paciente": req.body.uf,
      "complemento_paciente": req.body.complemento
    }

    /**Próxima etapa do cadastro */

    return res.render("pages/cad-dados-pac", {
      erros: errors,
      dadosNotificacao: null,

      valores: req.body,
    });


  },


  /**Etapa Final da validação */

  validaCadDados: [

    /**Validação form cadastro_dados */

    body("email").isEmail().withMessage("E-mail inválido!")
    .custom(async (value)=> {
      const email = await usuarioModel.findCampoCustomPac({email_usuario: value});
      if(email > 0){
        throw new Error("E-mail em uso!");
      }
    }),

    body("confirmaemail").custom((value, { req }) => {
      return value === req.body.email;
    }).withMessage("Emails estão diferentes"),

    body("senha").isStrongPassword().withMessage("Senha muito fraca!"),

    body("confirmasenha").custom((value, { req }) => {
      return value === req.body.senha;
    }).withMessage("Senhas estão diferentes"),

  ],

  /**Inserção dos dados no Banco + Requisição do Model */

  cadDadosPac: async (req, res) => {

    /**Erros da validação */
    const errors = validationResult(req);

     /**Antes de passar os dados preciso criptografar a senha */
    const salt = await bcrypt.genSalt(10);
    const novaSenha = await bcrypt.hash(req.body.senha, salt);


    const dadosUsuarioPac = {

      /**Dados armazenados nas sessions */
      ...req.session.dadosPac,
      "email_usuario": req.body.email,
      "senha_usuario": novaSenha,

    }

    if (!errors.isEmpty()) {

      /**Se a lista não está vazia */
      return res.render("pages/cad-dados-pac", {
        erros: errors,
        dadosNotificacao: {
          titulo: "Erro ao inserir os dados!",
          mensagem: "Verifique os valores digitados!",
          tipo: "error",
        },

        valores: req.body,
      });

    }

   
    try {
      let InsertPacResult = await usuarioModel.createPac(dadosUsuarioPac);

      /**Se existir resultado positivo no cadastro */

      res.render("pages/logado-user-pac", {
      erros: errors,
      dadosNotificacao: null,

      valores: req.body,
    });


    } catch (errors) {
      console.log("Erro no cadastro" + errors);
      res.render("pages/cad-dados-pac", {
        erros: errors,
        dadosNotificacao: {
          titulo: "Erro ao inserir os dados!",
          mensagem: "Verifique os valores digitados!",
          tipo: "error",
        },

        valores: req.body,
      });

      return false
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
      res.render("pages/cadastro_inicial", { "erros": erros, "valores": req.body, "retorno": null })
    }
  },
};






module.exports = usuarioController;



