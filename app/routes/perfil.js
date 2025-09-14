const express = require('express');
const multer = require('multer');
const path = require('path');
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

// Rota para atualizar perfil
router.post('/atualizar', upload.single('inputFoto'), (req, res) => {
    try {
        const { nome, email, cpf, dataNascimento, endereco } = req.body;
        
        // Validações básicas
        if (!nome || !email || !cpf) {
            return res.status(400).json({
                success: false,
                message: 'Campos obrigatórios não preenchidos'
            });
        }

        // Dados do perfil atualizado
        const perfilAtualizado = {
            nome,
            email,
            cpf,
            dataNascimento,
            endereco
        };

        // Se uma nova imagem foi enviada
        if (req.file) {
            perfilAtualizado.fotoPerfil = `/uploads/perfil/${req.file.filename}`;
        }

        // Aqui você salvaria no banco de dados
        // await Usuario.findByIdAndUpdate(req.user.id, perfilAtualizado);

        res.json({
            success: true,
            message: 'Perfil atualizado com sucesso',
            data: perfilAtualizado
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