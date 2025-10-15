const profModel = require("../model/profModel");
const { body, validationResult } = require("express-validator");
var { validarCPF, validarCEP, converterParaMysql,
  isValidDate,
  isMaiorDeIdade, limparValorReais } = require("../helpers/validacoes");
  const moment = require('moment');
const bcrypt = require('bcryptjs');
const emailService = require('../util/emailService');
const usuarioModel = require('../model/usuarioModel');


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
      })


      /**Verificar se já existe usuário com esse CPF no sistema */
      .custom(async (value) => {
        const cpf = await profModel.findCampoCustomProf({ cpf_usuario: value });
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
    body("rg_prof").isLength({ min: 4, max: 6 }).withMessage("Insira um registro válido!")


      /**Verificar se já existe especialista com esse registro, na especialidade escolhida  */
      .custom(async (value, { req }) => {
        const rg = await profModel.findCampoCustomRgProf(value, req.body.especialidadeprof);
        if (rg > 0) {
          throw new Error("Já existe um registro cadastrado!");
        }
        return true;
      }),

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
      "num_registro_especialista": req.body.rg_prof
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
      "logradouro_especialista": req.body.endereco,
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

  cadDadosProf: async (req, res) => {

    /**Erros da validação */
    const errors = validationResult(req);
    console.log(errors);

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


      /**Se a lista não está vazia */

      return res.render("pages/cad-dados-prof", {
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
      console.log('Tentando criar profissional:', dadosUsuarioProf);
      let InsertProfResult = await profModel.createProf(dadosUsuarioProf);
      console.log('Profissional criado:', InsertProfResult);
      
      // Gerar token de verificação
      const token = emailService.gerarToken();
      console.log('Token gerado:', token);
      await usuarioModel.salvarTokenVerificacao(InsertProfResult.idUsuario, token);
      
      // Enviar email de verificação
      console.log('Enviando email para:', dadosUsuarioProf.email_usuario);
      await emailService.enviarEmailVerificacao(
        dadosUsuarioProf.email_usuario,
        dadosUsuarioProf.nome_usuario,
        token
      );
      console.log('Email enviado com sucesso');

      /**Renderizar página de confirmação */
      res.render("pages/email-enviado", {
        erros: errors,
        dadosNotificacao: {
          titulo: "Cadastro realizado!",
          mensagem: "Verifique seu email para ativar a conta.",
          tipo: "success"
        },
        email: dadosUsuarioProf.email_usuario,
        valores: req.body,
      });



    } catch (errors) {
      console.log("Erro no cadastro de profissional:", errors);
      console.log("Stack trace:", errors.stack);
      res.render("pages/cad-dados-prof", {
        erros: null,
        dadosNotificacao: {
          titulo: "Erro ao inserir os dados!",
          mensagem: "Verifique os valores digitados",
          tipo: "error"
        },

        valores: req.body,

      });

      return false
    }

  },


  /************************************************************************LOGIN DO PROFISSIONAL***************************** */


  /**vALIDAÇÃO DOS CAMPOS DE LOGIN DO PROFISSIONAL */

  validaloginProf: [
    body("email").isEmail().withMessage("Email inválido."),
    body("senha").isStrongPassword().withMessage("Senha inválida!"),

  ],



  logarProf: (req, res) => {
    const erros = validationResult(req);
    console.log("erros")
    console.log(erros)
    if (!erros.isEmpty()) {
      return res.render("pages/login-prof", { listaErros: erros, dadosNotificacao: null, valores: req.body });
    }

    // Verificar se o email não foi verificado
    if (req.session.emailNaoVerificado) {
      // Verificar se é paciente tentando logar como profissional
      if (req.session.emailNaoVerificado.tipo === 1) {
        return res.render("pages/login-prof", {
          listaErros: null,
          dadosNotificacao: {
            titulo: "Acesso incorreto!",
            mensagem: "Você é um paciente. Use o login de pacientes.",
            tipo: "error"
          },
          valores: req.body
        });
      }
      
      return res.render("pages/email-nao-verificado", {
        listaErros: null,
        dadosNotificacao: {
          titulo: "Email não verificado!",
          mensagem: "Verifique seu email para ativar a conta.",
          tipo: "warning"
        },
        email: req.session.emailNaoVerificado.email,
        nome: req.session.emailNaoVerificado.nome,
        valores: req.body
      });
    }

    if (req.session.autenticado.autenticado != null) {
      // Verificar se é paciente tentando logar como profissional
      if (req.session.autenticado.tipo === 1) {
        req.session.autenticado = { autenticado: null, id: null, tipo: null };
        return res.render("pages/login-prof", {
          listaErros: null,
          dadosNotificacao: {
            titulo: "Acesso incorreto!",
            mensagem: "Você é um paciente. Use o login de pacientes.",
            tipo: "error"
          },
          valores: req.body
        });
      }

      // Usuário autenticado corretamente - redirecionar para home do especialista
      return res.redirect('/homepro');
    } else {
      // Login falhou
      return res.render("pages/login-prof", {
        listaErros: null,
        dadosNotificacao: {
          titulo: "Falha ao logar!", 
          mensagem: "Usuário e/ou senhas inválidos!", 
          tipo: "error"
        },
        valores: req.body
      });
    }
  },


  /************************************************AGENDA INSERT DO PROFISSIONAL */


  validaloginProf: [
    body("email").isEmail().withMessage("Email inválido."),
    body("senha").isStrongPassword().withMessage("Senha inválida!"),

  ],


  validaAgendaInsert: [

    /**Hora de trabalho- validação */
    body("hrinicio").matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Formato de hora inválido'),
    body("hrfim").matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Formato de hora inválido'),

    /**Pausa de trabalho- validação */
    /*body("pausa_inicio").matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Formato de hora inválido'),
    body("pausa_fim").matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Formato de hora inválido'),*/

    /**Preço e taxa da consulta */
    body("preco").customSanitizer(value => limparValorReais(value))
      .isFloat({ min: 0 })
      .withMessage('Informe um valor válido em reais'),

    
  ],


  /**Insert da agenda */

  criarAgenda: async (req, res) => {

    /**Armazenar os erros de validação */
    const errors = validationResult(req);
    console.log(errors);

    /**Se a lista não está vazia eu mantenho o user na mesma página */
    if (!errors.isEmpty()) {
      return res.render("pages/config_agenda_prof", {
        erros: errors,

        /*dadosNotificacao: {
          titulo: "Erro ao inserir os dados!",
          mensagem: "Verifique os valores digitados!",
          tipo: "error",
        },*/
        
        valores: req.body,
      });

    }

    /**Conversão dos campos de preço para eu conseguir inserir os dados do tipo DECIMAL no banco de dados */

    
    const precoFormatado = limparValorReais(req.body.preco)
    const taxaFormatada = limparValorReais(req.body.taxa);


    /**Regras para a definição da duração da consulta com base no tipod e atendimento*/
    if (req.body.modalidade == 1) {
      var tempoConsulta = 30 //online
    } else {
      var tempoConsulta = 50 //domiciliar
    }


    const id_especialista = await profModel.selectIdEspecialista(req)

    /**Armazenando as variáveis para o Model */
    /**Variáveis da tabela Disponibilidade_especialista */

    const dadosAgenda = {
      "dia_semana": req.body.semanadia,
      "hr_inicio": req.body.hrinicio,
      "hr_fim": req.body.hrfim,
      "tipo_atendimento": req.body.modalidade,
      "duracao_consulta": tempoConsulta,
      "preco_base": precoFormatado,
      "taxa_locomocao": taxaFormatada,
      "id_especialista": id_especialista //chave estrangeira

    }

    /**Variáveis da tabela pausa_especialista */

   

    const pausas = req.body.pausas || []; // pode ser um array vazio

    

    /**Se está vazia, tento fazer o insert chamando o Model */
    try {

      let InsertAgendaProf = await profModel.configAgendaProf(dadosAgenda,pausas);

      /**Se deu tudo certo, renderizo a página de home de agenda do profissional */
      res.render("pages/home_agenda_prof", {
        erros: null,
        valores: req.body,
      });

      /**Se houve um erro no banco - inserção  */
    } catch (errors) {
      console.log("Erro na inserção" + errors);
      res.render("pages/config_agenda_prof", {
        erros: null,
        /*dadosNotificacao: {
          titulo: "Erro ao inserir os dados!",
          mensagem: "Verifique os valores digitados",
          tipo: "error"
        },*/

        valores: req.body,

      });

      return false
    }

  },

  /**FILTRO DA AGENDA **************************************** */
 
  /*findAgendaProf: async (req,res)=>{
 
    try {
 
      const id_especialista = await profModel.selectIdEspecialista(req);
      semanadia= req.body.semanadia;
 
      if(semanadia==0){
 
      results = await profModel.findAllFiltroProf(id_especialista);
      res.render("pages/home_agenda_prof", { agendas: results });
 
      }else{
      results = await profModel.findFiltroProf(id_especialista, semanadia);
      res.render("pages/home_agenda_prof", { agendas: results });
 
    }
 
    } catch (e) {
      console.log(e); // exibir os erros no console do vs code
      res.json({ erro: "Falha ao acessar dados" });
    }
  },*/

  findAgendaProf: async (req, res) => {
  try {
    const id_especialista = await profModel.selectIdEspecialista(req);

    /**DEBUG */
    if (!id_especialista) {
        return res.status(400).send("Erro: Especialista não encontrado.");
      }

    const semanadia = Number(req.body.semanadia);

    console.log("ID especialista:", id_especialista);
    console.log("Dia da semana recebido:", semanadia);

    let agendas = [];

    if (semanadia === 0) {
      agendas = await profModel.findAllFiltroProf(id_especialista);
    } else {
      agendas = await profModel.findFiltroProf(id_especialista, semanadia);
    }
  

    /// 4️⃣ Para cada agenda, buscar suas pausas correspondentes
      const agendasComPausas = [];
      for (const agenda of agendas) {
        const pausas = await profModel.findPausa(agenda.id_disponibilidade_especialista);
        agendasComPausas.push({
          ...agenda, // copia todos os dados da agenda
          pausas     // adiciona o array de pausas dentro do objeto
        });
      }
      // 5️⃣ Envia tudo pro EJS renderizar
      res.render("pages/home_agenda_prof", {
        agendas: agendasComPausas,
        semanadia
      });


  } catch (error) {
    console.log("Erro no controller findAgendaProf:", error);
    res.status(500).json({ erro: "Falha ao acessar dados" });
  }
}
 
 
 
  /*
  findAllAgendaProf: async (req, res) => {
   
    try {
 
      const id_especialista = await profModel.selectIdEspecialista(req);
 
      results = await profModel.findAllFiltroProf(id_especialista);
      res.render("pages/home_agenda_prof", { agenda: results });
 
    } catch (e) {
      console.log(e); // exibir os erros no console do vs code
      res.json({ erro: "Falha ao acessar dados" });
    }
  },
 
 
  findFiltroAgendaProf: async (req, res) => {
 
    const id_especialista = await profModel.selectIdEspecialista(req);
 
    let semanadia = req.body.semanadia
 
 
    try {
      results = await profModel.findFiltroProf(id_especialista, semanadia);
      res.render("pages/home_agenda_prof", { agenda: results });
 
    } catch (e) {
      console.log(e); // exibir os erros no console do vs code
      res.json({ erro: "Falha ao acessar dados" });
    }
  },*/
 
 
};
 
 
 
 
 







module.exports = profController