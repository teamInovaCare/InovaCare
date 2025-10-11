const express = require('express');
const multer = require('multer');
const path = require('path');
const usuarioModel = require('../model/usuarioModel');
const moment = require('moment');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'app/public/uploads/perfil/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'perfil-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Apenas imagens são permitidas!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

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
            return res.status(404).render('pages/erro', {
                mensagem: 'Usuário não encontrado'
            });
        }

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
        const enderecoCompleto = `${dadosUsuario.logradouro_paciente || ''}, ${dadosUsuario.num_resid_paciente || ''}, ${dadosUsuario.bairro_paciente || ''} - ${dadosUsuario.cidade_paciente || ''} - ${dadosUsuario.uf_paciente || ''}`;

        // Renderizar página do perfil com os dados
        res.render('pages/perfil', {
            usuario: {
                nome: dadosUsuario.nome_usuario,
                email: dadosUsuario.email_usuario,
                cpf: dadosUsuario.cpf_usuario,
                dataNascimento: dataNascimento,
                idade: idadeDetalhada,
                enderecoCompleto: enderecoCompleto,
                cep: dadosUsuario.cep_paciente,
                endereco: dadosUsuario.logradouro_paciente,
                numero: dadosUsuario.num_resid_paciente,
                complemento: dadosUsuario.complemento_paciente,
                bairro: dadosUsuario.bairro_paciente,
                cidade: dadosUsuario.cidade_paciente,
                uf: dadosUsuario.uf_paciente,
                foto: dadosUsuario.foto_usuario
            }
        });

    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        res.status(500).render('pages/erro', {
            mensagem: 'Erro interno do servidor'
        });
    }
});

// Validações para atualização do perfil
const validarAtualizacao = [
    body('nome').isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
    body('email').isEmail().withMessage('Email inválido'),
    body('cep').optional().matches(/^\d{5}-?\d{3}$/).withMessage('CEP inválido')
];

// Rota para atualizar perfil
router.post('/atualizar', upload.single('inputFoto'), validarAtualizacao, async (req, res) => {
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

        // Se uma nova imagem foi enviada, adicionar ao objeto de atualização
        if (req.file) {
            dadosAtualizacao.foto = req.file.filename;
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

module.exports = router;