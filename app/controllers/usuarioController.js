const usuarioModel = require("../model/usuarioModel");
const { body, validationResult } = require("express-validator");
var { validarCPF, validarCEP, converterParaMysql,
  isValidDate,
  isMaiorDeIdade } = require("../helpers/validacoes");
const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(12);
const { removeImg } = require("../util/removeImg");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const https = require('https');




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

      })
      /**Verificar se já existe um CPF cadastrado no banco */
      .custom(async (value) => {
        const cpf = await usuarioModel.findCampoCustomCpf({ cpf_usuario: value });
        if (cpf > 0) {
          throw new Error("CPF em uso!");
        }
        return true;
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
      .custom(async (value) => {
        const email = await usuarioModel.findCampoCustomPac({ email_usuario: value });
        if (email > 0) {
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

        /*Aqui eu mostro os erros de validação*/
        dadosNotificacao: {
          titulo: "Erro ao inserir os dados!",
          mensagem: "Verifique os valores digitados!",
          tipo: "error",
        },

        valores: req.body,
      });

    }

    /*Sucesso ao cadastrar + usuário é  autenticado pela primeira vez*/
    try {
      let InsertPacResult = await usuarioModel.createPac(dadosUsuarioPac);
      req.session.autenticado = autenticado = {
        autenticado: dadosUsuarioPac.nome_usuario,
        id: InsertPacResult.insertId,
        tipo: 1
      }

      /**Se existir resultado positivo no cadastro */

      res.render("pages/logado-user-pac", {
        erros: errors,
        login: 1,
        dadosNotificacao: null,
        autenticado: req.session.autenticado,

        valores: req.body,
      });


      /*Erro na inserçãod e dados, não no cadastro (validation Result)*/
    } catch (errors) {

      console.log("Erro no cadastro" + errors);
      res.render("pages/cad-dados-pac", {
        erros: null,
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



  //   logar: async (req, res) => {
  //     const erros = validationResult(req);
  //     if (!erros.isEmpty()) {

  //       return res.render("pages/cadastro_inicial", { "erros": erros, "valores": req.body, "retorno": null })
  //     }
  //     if (req.session.autenticado.autenticado != null) {
  //       console.log(req.session.autenticado)
  //       res.render("pages/index");

  //     } else {
  //       res.render("pages/cadastro_inicial", { "erros": erros, "valores": req.body, "retorno": null })
  //     }
  //   },
  // };

  logarPac: (req, res) => {
    const erros = validationResult(req);
    console.log("erros")
    console.log(erros)
    if (!erros.isEmpty()) {
      return res.render("pages/login-pac", { listaErros: erros, dadosNotificacao: null, valores: req.body });

    }

    if (req.session.autenticado.autenticado != null) {

      // Usuário autenticado corretamente
      return res.render("pages/logado-user-pac", {

        listaErros: erros,
        autenticado: req.session.autenticado,
        login: req.session.logado,
        dadosNotificacao: null,
        valores: req.body
      });
    } else {
      // Login falhou
      return res.render("pages/login-pac", {
        listaErros: null,

        dadosNotificacao: {
          titulo: "Falha ao logar!", mensagem: "Uusário e/ou senhas inválidos!", tipo: "error",
        },
        valores: req.body


      });
    }
  },

  mostrarPerfil: async (req, res) => {
    try {
      let results = await usuario.findId(req.session.autenticado.id);
      if (results[0].cep_usuario != null) {
        const httpsAgent = new https.Agent({
          rejectUnauthorized: false,
        });
        const response = await fetch(`https://viacep.com.br/ws/${results[0].cep_usuario}/json/`,
          { method: 'GET', headers: null, body: null, agent: httpsAgent, });
        var viaCep = await response.json();
        var cep = results[0].cep_usuario.slice(0, 5) + "-" + results[0].cep_usuario.slice(5)
      } else {
        var viaCep = { logradouro: "", bairro: "", localidade: "", uf: "" }
        var cep = null;
      }

      let campos = {
        nome_usu: results[0].nome_usuario, email_usu: results[0].email_usuario,
        cep: cep,
        numero: results[0].numero_usuario,
        complemento: results[0].complemento_usuario, logradouro: viaCep.logradouro,
        bairro: viaCep.bairro, localidade: viaCep.localidade, uf: viaCep.uf,
        img_perfil_pasta: results[0].img_perfil_pasta,
        img_perfil_banco: results[0].img_perfil_banco != null ? `data:image/jpeg;base64,${results[0].img_perfil_banco.toString('base64')}` : null,
        nomeusu_usu: results[0].user_usuario, fone_usu: results[0].fone_usuario, senha_usu: ""
      }

      res.render("pages/perfil", { listaErros: null, dadosNotificacao: null, valores: campos })
    } catch (e) {
      console.log(e);
      res.render("pages/perfil", {
        listaErros: null, dadosNotificacao: null, valores: {
          img_perfil_banco: "", img_perfil_pasta: "", nome_usu: "", email_usu: "",
          nomeusu_usu: "", fone_usu: "", senha_usu: "", cep: "", numero: "", complemento: "",
          logradouro: "", bairro: "", localidade: "", uf: ""
        }
      })
    }
  },

  gravarPerfil: async (req, res) => {

    const erros = validationResult(req);
    const erroMulter = req.session.erroMulter;
    if (!erros.isEmpty() || erroMulter != null) {
      lista = !erros.isEmpty() ? erros : { formatter: null, errors: [] };
      if (erroMulter != null) {
        lista.errors.push(erroMulter);
      }
      return res.render("pages/perfil", { listaErros: lista, dadosNotificacao: null, valores: req.body })
    }
    try {
      var dadosForm = {
        user_usuario: req.body.nomeusu_usu,
        nome_usuario: req.body.nome_usu,
        email_usuario: req.body.email_usu,
        fone_usuario: req.body.fone_usu,
        cep_usuario: req.body.cep.replace("-", ""),
        numero_usuario: req.body.numero,
        complemento_usuario: req.body.complemento,
        img_perfil_banco: req.session.autenticado.img_perfil_banco,
        img_perfil_pasta: req.session.autenticado.img_perfil_pasta,
      };
      if (req.body.senha_usu != "") {
        dadosForm.senha_usuario = bcrypt.hashSync(req.body.senha_usu, salt);
      }
      if (!req.file) {
        console.log("Falha no carregamento");
      } else {
        //Armazenando o caminho do arquivo salvo na pasta do projeto 
        caminhoArquivo = "imagem/perfil/" + req.file.filename;
        //Se houve alteração de imagem de perfil apaga a imagem anterior
        if (dadosForm.img_perfil_pasta != caminhoArquivo) {
          removeImg(dadosForm.img_perfil_pasta);
        }
        dadosForm.img_perfil_pasta = caminhoArquivo;
        dadosForm.img_perfil_banco = null;

        // //Armazenando o buffer de dados binários do arquivo 
        // dadosForm.img_perfil_banco = req.file.buffer;                
        // //Apagando a imagem armazenada na pasta
        // if(dadosForm.img_perfil_pasta != null ){
        //     removeImg(dadosForm.img_perfil_pasta);
        // }
        // dadosForm.img_perfil_pasta = null; 
      }
      let resultUpdate = await usuario.update(dadosForm, req.session.autenticado.id);
      if (!resultUpdate.isEmpty) {
        if (resultUpdate.changedRows == 1) {
          var result = await usuario.findId(req.session.autenticado.id);
          var autenticado = {
            autenticado: result[0].nome_usuario,
            id: result[0].id_usuario,
            tipo: result[0].id_tipo_usuario,
            img_perfil_banco: result[0].img_perfil_banco != null ? `data:image/jpeg;base64,${result[0].img_perfil_banco.toString('base64')}` : null,
            img_perfil_pasta: result[0].img_perfil_pasta
          };
          req.session.autenticado = autenticado;
          var campos = {
            nome_usu: result[0].nome_usuario, email_usu: result[0].email_usuario,
            img_perfil_pasta: result[0].img_perfil_pasta, img_perfil_banco: result[0].img_perfil_banco,
            nomeusu_usu: result[0].user_usuario, fone_usu: result[0].fone_usuario, senha_usu: ""
          }
          res.render("pages/perfil", { listaErros: null, dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "Alterações Gravadas", tipo: "success" }, valores: campos });
        } else {
          res.render("pages/perfil", { listaErros: null, dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "Sem alterações", tipo: "success" }, valores: dadosForm });
        }
      }
    } catch (e) {
      console.log(e)
      res.render("pages/perfil", { listaErros: erros, dadosNotificacao: { titulo: "Erro ao atualizar o perfil!", mensagem: "Verifique os valores digitados!", tipo: "error" }, valores: req.body })
    }
  },


  filtroMedicos: async (req, res) => {
 
    try {
 
      //cidade_local, nome_especialidade, nome_usuario, tipo_atendimento
 
     var cidade_local = req.body.local;
     var nome_especialidade = req.body.especialidade;
     var nome_usuario = req.body.nomeProf;
     var tipo_atendimento = req.body.modalidade
 
 
    let result = await usuarioModel.findMedicoFiltro(cidade_local, nome_especialidade,nome_usuario,tipo_atendimento  );
 
      res.render("pages/cg", {
        medicos: result,
 
      }
 
      );
 
    } catch (error) {
      console.log("Erro no controller findAgendaProf:", error);
      res.status(500).json({ erro: "Falha ao acessar dados" });
    }
  },

};







module.exports = usuarioController;



