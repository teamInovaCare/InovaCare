const pool = require("../../config/pool_conection");
const bcrypt = require('bcryptjs');


/*CADASTRO DO USUÁRIO 1 - PACIENTE*/

const profModel = {
    createProf: async (dadosUsuarioProf) => {
        
        
        try {

            const [resultUserProf] = await pool.query(
                `insert into usuarios 
                (tipo_usuario, status_usuario, nome_usuario, email_usuario, cpf_usuario, senha_usuario, foto_usuario)
                values(?,?,?,?,?,?,?)`,

                [
                    '2', //tipo de usuário
                    '0',//status pendente
                    dadosUsuarioProf.nome_usuario,
                    dadosUsuarioProf.email_usuario,
                    dadosUsuarioProf.cpf_usuario,
                    dadosUsuarioProf.senha_usuario,
                    null //foto

                ]

            );

            if (!resultUserProf.insertId) {
            throw new Error("Falha ao criar usuário");
        }


            const idUsuario = resultUserProf.insertId;

            // 2. Inserir na tabela pacientes
            const [resultEspecialistas] = await pool.query(

                `INSERT INTO ESPECIALISTAS
                (dt_nasc_especialista, logradouro_especialista, num_resi_especialista, complemento_especialista, bairro_especialista, cidade_especialista, uf_especialista, cep_especialista, id_especialidade, id_usuario)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    dadosUsuarioPac.dt_nasc_especialista,
                    dadosUsuarioPac.logradouro_especialista,
                    dadosUsuarioPac.num_resid_especialista,
                    dadosUsuarioPac.complemento_especialista,
                    dadosUsuarioPac.bairro_especialista,
                    dadosUsuarioPac.cidade_especialista,
                    dadosUsuarioPac.uf_especialista,
                    dadosUsuarioPac.cep_especialista,
                    dadosUsuarioProf.id_especialidade,
                    idUsuario
                ]
            );

            if (!resultEspecialistas.insertId) {
            throw new Error("Falha ao criar especialista");
        }

            return { resultUserProf, resultEspecialistas };
        } catch (error) {
            console.log(error);
            throw error;
        }
    },




    /**Select no banco para buscar o usuário pelo email */
    findUserEmail: async (camposForm) => {
        try {
            const [resultados] = await pool.query(
                "SELECT * FROM usuarios WHERE email_usuario = ?",
                [camposForm.email_usuario]
            )
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

};





module.exports = profModel;





