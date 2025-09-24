const pool = require("../../config/pool_conection");
const moment = require("moment");
const bcrypt = require('bcryptjs');


/*CADASTRO DO USUÁRIO 1 - PACIENTE*/

const usuarioModel = {
    createPac: async (dadosUsuarioPac) => {

        let connection;
        
        
        try {

            connection= await pool.getConnection();
            await connection.beginTransaction()

            const [resultUsuarios] = await pool.query(
                `insert into usuarios 
                (tipo_usuario, status_usuario, nome_usuario, email_usuario, cpf_usuario, senha_usuario, foto_usuario)
                values(?,?,?,?,?,?,?)`,

                [
                    '1', //tipo de usuário
                    '0',//status pendente
                    dadosUsuarioPac.nome_usuario,
                    dadosUsuarioPac.email_usuario,
                    dadosUsuarioPac.cpf_usuario,
                    dadosUsuarioPac.senha_usuario,
                    null //foto

                ]

            );

            if (!resultUsuarios.insertId) {
            throw new Error("Falha ao criar usuário");
        }

            const idUsuario = resultUsuarios.insertId;

            // 2. Inserir na tabela pacientes
            const [resultPacientes] = await connection.query(

                `INSERT INTO pacientes 
                (dt_nasc_paciente, logradouro_paciente, num_resid_paciente, complemento_paciente, bairro_paciente, cidade_paciente, uf_paciente, cep_paciente, id_usuario)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    moment(dadosUsuarioPac.dt_nasc_paciente).format('YYYY-MM-DD'),
                    dadosUsuarioPac.logradouro_paciente,
                    dadosUsuarioPac.num_resid_paciente,
                    dadosUsuarioPac.complemento_paciente,
                    dadosUsuarioPac.bairro_paciente,
                    dadosUsuarioPac.cidade_paciente,
                    dadosUsuarioPac.uf_paciente,
                    dadosUsuarioPac.cep_paciente,
                    idUsuario
                ]
            );

            if (!resultPacientes.insertId) {
            throw new Error("Falha ao criar paciente");
        }

        await connection.commit();


            return { resultUsuarios, resultPacientes };

        } catch (error) {
            console.log(error);
            throw error;
        }finally{
            if(connection) connection.release();
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





module.exports = usuarioModel;


