const express = require('express');
const usuarioModel = require('../model/usuarioModel');
const moment = require('moment');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Usar o uploader da pasta util
const uploadFile = require("../util/uploader")("./app/public/imagens/perfil/", 5);
//const uploadFile = require("../util/uploader")();

// Rota para exibir perfil
router.get('/', async (req, res) => {
    try {
        // Verificar se o usuário está autenticado
        if (!req.session.autenticado || !req.session.autenticado.id) {
            return res.redirect('/login-pac');
        }

        // Buscar dados do usuário no banco
        const dadosUsuario = await usuarioModel.findUserById(req.session.autenticado.id);
        
        if (!dadosUsuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Buscar informações médicas do paciente
        let infoMedica = null;
        if (dadosUsuario.id_paciente) {
            infoMedica = await usuarioModel.findInfoMedica(dadosUsuario.id_paciente);
        }
        
        console.log('Dados do usuário encontrados:', dadosUsuario);
        console.log('Info médica encontrada:', infoMedica);

        // Formatar data de nascimento
        const dataNascimento = dadosUsuario.dt_nasc_paciente ? 
            moment(dadosUsuario.dt_nasc_paciente).format('DD/MM/YYYY') : '';

        // Calcular idade detalhada
        let idadeDetalhada = null;
        if (dadosUsuario.dt_nasc_paciente) {
            const nascimento = moment(dadosUsuario.dt_nasc_paciente);
            const hoje = moment();
            
            const anos = hoje.diff(nascimento, 'years');
            const meses = hoje.diff(nascimento.add(anos, 'years'), 'months');
            const dias = hoje.diff(nascimento.add(meses, 'months'), 'days');
            
            idadeDetalhada = `${anos} anos, ${meses} meses e ${dias} dias.`;
        }

        // Montar endereço completo
        const partes = [
            dadosUsuario.logradouro_paciente,
            dadosUsuario.num_resid_paciente,
            dadosUsuario.bairro_paciente,
            dadosUsuario.cidade_paciente,
            dadosUsuario.uf_paciente
        ].filter(parte => parte && parte.trim() !== '');
        
        const enderecoCompleto = partes.length > 0 ? partes.join(', ') : 'Endereço não informado';

        // Renderizar página do perfil com os dados
        res.render('pages/perfil', {
            usuario: {
                nome: dadosUsuario.nome_usuario || '',
                email: dadosUsuario.email_usuario || '',
                cpf: dadosUsuario.cpf_usuario || '',
                dataNascimento: dataNascimento || '',
                idade: idadeDetalhada || 'Não informado',
                enderecoCompleto: enderecoCompleto,
                cep: dadosUsuario.cep_paciente || '',
                endereco: dadosUsuario.logradouro_paciente || '',
                numero: dadosUsuario.num_resid_paciente || '',
                complemento: dadosUsuario.complemento_paciente || '',
                bairro: dadosUsuario.bairro_paciente || '',
                cidade: dadosUsuario.cidade_paciente || '',
                uf: dadosUsuario.uf_paciente || '',
                foto: dadosUsuario.foto_usuario || null,
                idPaciente: dadosUsuario.id_paciente || null,
                diagnostico: infoMedica?.diagnostico_paciente || '',
                medicamentoContinuo: infoMedica?.medicamento_cont || '',
                alergias: infoMedica?.alergia || '',
                cirurgia: infoMedica?.cirurgia || 'N'
            }
        });

    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});



// Validações para atualização do perfil
const validarAtualizacao = [
    body('nome').isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
    body('email').isEmail().withMessage('Email inválido'),
    body('cep').optional().matches(/^\d{5}-?\d{3}$/).withMessage('CEP inválido')
];

// Rota para atualizar perfil
router.post('/atualizar', uploadFile('inputFoto'), validarAtualizacao, async (req, res) => {
    try {
        // Verificar erros de validação
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Dados inválidos',
                errors: errors.array()
            });
        }

        // Verificar se o usuário está autenticado
        if (!req.session.autenticado || !req.session.autenticado.id) {
            return res.status(401).json({
                success: false,
                message: 'Usuário não autenticado'
            });
        }

        const { nome, email, cpf, dataNascimento, cep, endereco, numero, complemento, bairro, cidade, uf } = req.body;
        
        // Validações básicas
        if (!nome || !email) {
            return res.status(400).json({
                success: false,
                message: 'Nome e email são obrigatórios'
            });
        }

        // Dados para atualização
        const dadosAtualizacao = {
            nome,
            email,
            cpf,
            dataNascimento,
            cep,
            endereco,
            numero,
            complemento,
            bairro,
            cidade,
            uf
        };

        // Verificar se deve remover a foto
        if (req.body.removerFoto === 'true') {
            dadosAtualizacao.foto = null;
        } else if (req.body.fotoBase64) {
            // Salvar base64 da imagem
            dadosAtualizacao.foto = req.body.fotoBase64;
        }
        
        // Verificar se houve erro no upload
        if (req.session.erroMulter) {
            return res.status(400).json({
                success: false,
                message: req.session.erroMulter.msg
            });
        }

        // Atualizar no banco de dados
        await usuarioModel.updateUser(req.session.autenticado.id, dadosAtualizacao);

        // Atualizar nome na sessão
        req.session.autenticado.autenticado = nome;

        res.json({
            success: true,
            message: 'Perfil atualizado com sucesso'
        });

    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Rota para atualizar informações médicas
router.post('/atualizar-medico', async (req, res) => {
    console.log('Rota /atualizar-medico chamada');
    try {
        // Verificar se o usuário está autenticado
        if (!req.session.autenticado || !req.session.autenticado.id) {
            console.log('Usuário não autenticado');
            return res.status(401).json({
                success: false,
                message: 'Usuário não autenticado'
            });
        }

        // Buscar dados do usuário para obter o ID do paciente
        const dadosUsuario = await usuarioModel.findUserById(req.session.autenticado.id);
        
        if (!dadosUsuario || !dadosUsuario.id_paciente) {
            return res.status(404).json({
                success: false,
                message: 'Paciente não encontrado'
            });
        }

        const { diagnostico, medicamentoContinuo, alergias, cirurgia } = req.body;
        
        console.log('Dados recebidos no servidor:', req.body);
        
        // Dados médicos para atualização
        const dadosMedicos = {
            diagnostico: diagnostico || null,
            medicamentoContinuo: medicamentoContinuo || null,
            alergias: alergias || null,
            cirurgia: cirurgia === 'S' ? 'S' : 'N'
        };
        
        console.log('Dados processados para o banco:', dadosMedicos);

        // Atualizar no banco de dados
        await usuarioModel.upsertInfoMedica(dadosUsuario.id_paciente, dadosMedicos);

        res.json({
            success: true,
            message: 'Informações médicas atualizadas com sucesso'
        });

    } catch (error) {
        console.error('Erro ao atualizar informações médicas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

module.exports = router;