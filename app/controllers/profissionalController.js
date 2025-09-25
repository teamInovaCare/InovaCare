const profModel = require("../model/profModel");
const { body, validationResult } = require("express-validator");
var { validarCPF, validarCEP, converterParaMysql,
  isValidDate,
  isMaiorDeIdade } = require("../helpers/validacoes");
const bcrypt = require('bcryptjs');


const profController = {

  /**Cad-inicial- validações */
  validaCadInicialProf: [

    /**validacção cadastro_inicial - nome-cpf e data */

    body("nome").isLength({ min: 3, max: 30 }).withMessage("Insira um nome válido."),
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
  cadIncialProf: async (req, res) => {

    /**Erros de validação */
    const errors = validationResult(req);

    /**Se a lista de erros não está vazia */
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.render("pages/cad-inicial-prof", {
        erros: errors,
        dadosNotificacao: {
          titulo: "Erro ao inserir os dados!",
          tipo: "error"
        },

        valores: req.body,

      });

    }

    /**Se não tem erros armazena os dados */
    req.session.dadosProf = {
      "nome_usuario": req.body.nome,
      "cpf_usuario": req.body.cpf,
      "dt_nasc_especialista": req.body.dt_nasc

    }

    /**Renderiza a próxima etapa do cadastro */
    return res.render("pages/cad-especialidade-prof", {
      erros: errors,
      dadosNotificacao: null,
      valores: req.body,

    });

  },


  validaCadEspecialidade: [

    /**Validação do Número do conselho regionald e medicina */
    body("rg_prof").isLength({ min: 4, max: 6 }).withMessage("Insira um registro válido!"),

  ],

  cadEspecialidade: async (req, res) => {

    /**Resultados da validação -erros */
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      /**SE a lista de erros não estiver vazia  */
      console.log(errors);
      return res.render("pages/cad-especialidade-prof", {
        erros: errors,
        dadosNotificacao: {
          titulo: "Erro ao inserir os dados!",
          tipo: "error"
        },

        valores: req.body,

      });

    }

    req.session.dadosProf = {
      ...req.session.dadosProf,
      "id_especialidade": req.body.especialidadeprof,
      "numero_registro": req.body.rg_prof
    }

    return res.render("pages/cad-local-prof", {
      erros: errors,
      dadosNotificacao: null,
      valores: req.body,

    });


  },




  /**validação cad-local-profissional*/

  validaCadLocalProf: [

    /**validação cad-local-paciente*/

    body("cep")
      .custom((value) => {
        if (validarCEP(value)) {
          return true
        } else {
          throw new Error("Cep Inválido")
        }
      }),
    body("complemento").isLength({ min: 0, max: 100 }).withMessage("Complemento inválido.")

  ],




  cadLocalProf: async (req, res) => {

    /**Erros de validação */
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      console.log(errors);

      /**Se a lista nãoe stiver vazia */
      return res.render("pages/cad-local-prof", {
        erros: errors,
        dadosNotificacao: {
          titulo: "Erro ao inserir os dados!",
          tipo: "error"
        },

        valores: req.body,

      });

    }

    /**Armazena os dados se não há erros */
    req.session.dadosProf = {
      /**Recebe o que já tem na variável */
      ...req.session.dadosProf,
      "cep_especialista": req.body.cep,
      "logradouro_especialista": req.body.logradouro,
      "bairro_especialista": req.body.bairro,
      "cidade_especialista": req.body.cidade,
      "num_resid_especialista": req.body.numero,
      "uf_especialista": req.body.uf,
      "complemento_especialista": req.body.complemento
    }

    /**Próxima etapa do cadastro */

    return res.render("pages/cad-dados-prof", {
      erros: errors,
      dadosNotificacao: null,
      valores: req.body,

    });

  },


  /**Etapa Final da validação */

  validaCadDadosProf: [

    /**Validação form cadastro_dados */

    body("email").isEmail().withMessage("E-mail inválido!")
      .custom(async (value) => {
        const email = await profModel.findCampoCustomProf({ email_usuario: value });
        if (email > 0) {
          throw new Errors("E-mail em uso!");
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

  cadDadosProf: async (req, res) => {

    /**Erros da validação */
    const errors = validationResult(req);

    /**Antes de passar os dados preciso criptografar a senha */
    const salt = await bcrypt.genSalt(10);
    const novaSenha = await bcrypt.hash(req.body.senha, salt);


    /**Se não há erros, vou criar a constante final que irá ser passada para o model */

    const dadosUsuarioProf = {

      /**Dados armazenados nas sessions */
      ...req.session.dadosProf,
      "email_usuario": req.body.email,
      "senha_usuario": novaSenha
    }


    if (!errors.isEmpty()) {
      console.log(errors);

      /**Se a lista não está vazia */

      return res.render("pages/cad-dados-prof", {
        erros: errors,
        dadosNotificacao: {
          titulo: "Erro ao inserir os dados!",
          tipo: "error"
        },

        valores: req.body,

      });
    }



    try {
      let InsertProfResult = await profModel.createProf(dadosUsuarioProf);



      /**Tela logada do apciente só para o teste */
      res.render("pages/logado-user-pac", {
        erros: errors,
        dadosNotificacao: {
          titulo: "Cadastro efetuado com sucesso!",
          mensagem: "Bem-vindo a InovaCare!",
          tipo: "sucess"
        },
        valores: req.body,

      });



    } catch (errors) {
      console.log("Erro no cadastro" + errors);
      res.render("pages/logado-user-pac", {
        erros: errors,
        dadosNotificacao: {
          titulo: "Erro ao inserir os dados!",
          mensagem: errors,
          tipo: "error"
        },

        valores: req.body,

      });


    }

  },

};


module.exports = profController