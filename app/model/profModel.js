const pool = require("../../config/pool_conection");
const moment = require("moment");
const bcrypt = require('bcryptjs');



/*CADASTRO DO USUÁRIO 1 - PACIENTE*/

const profModel = {
    createProf: async (dadosUsuarioProf) => {

        let connection;


        try {

            connection = await pool.getConnection();

            await connection.beginTransaction();

            /**Inserir na tabela usuários as informações básicas */

            const [resultUserProf] = await connection.query(
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

            /**Armazenar o id que foi inserido anteriormente */
            const idUsuario = resultUserProf.insertId;


            /**Conversão do formatod a data para inserção no banco de dados */
            const dataNascimentoFormatada = moment(dadosUsuarioProf.dt_nasc_especialista, 'DD/MM/YYYY').format('YYYY-MM-DD');

            // 2. Inserir na tabela pacientes
            const [resultEspecialistas] = await connection.query(

                `INSERT INTO especialistas
                (dt_nasc_especialista, logradouro_especialista, num_resid_especialista, complemento_especialista, bairro_especialista, cidade_especialista, uf_especialista, cep_especialista, num_registro_especialista, id_usuario, id_especialidade)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
                [
                    dataNascimentoFormatada,
                    dadosUsuarioProf.logradouro_especialista,
                    dadosUsuarioProf.num_resid_especialista,
                    dadosUsuarioProf.complemento_especialista,
                    dadosUsuarioProf.bairro_especialista,
                    dadosUsuarioProf.cidade_especialista,
                    dadosUsuarioProf.uf_especialista,
                    dadosUsuarioProf.cep_especialista,
                    dadosUsuarioProf.num_registro_especialista,
                    idUsuario,
                    dadosUsuarioProf.id_especialidade


                ]
            );

            if (!resultEspecialistas.insertId) {
                throw new Error("Falha ao criar especialista");
            }

            /**Commit das trabnsações para assegurar que só haverá inserção se houve sucesso em todos os inserts */
            await connection.commit();

            return {
                success: true,
                idUsuario: resultUserProf.insertId,
                idEspecialista: resultEspecialistas.insertId
            };

        } catch (error) {

            if (connection) {
                await connection.rollback();
            }
            console.log("Erro no createprofr", error);
            throw error;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },


    /**Buscar emails no banco para saber se algum já está em uso */

    findCampoCustomProf: async (criterioWhere) => {
        try {
            const [resultados] = await pool.query(
                "select count(*) totalReg from usuarios where ?",
                [criterioWhere]
            )
            return resultados[0].totalReg;


        } catch (error) {
            console.log(error);
            return error;
        }
    },




    /**Buscar registros no banco para saber se algum já está em uso */

    findCampoCustomRgProf: async (num_registro_especialista, id_especialidade) => {
        try {
            const [resultados] = await pool.query(
                ` select count(*) totalReg from especialistas
                 where num_registro_especialista=? and id_especialidade = ?`,
                [num_registro_especialista, id_especialidade ]
            )
            return resultados[0].totalReg;

        } catch (error) {
            console.log(error);
            return error;
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





