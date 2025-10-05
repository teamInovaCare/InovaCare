const pool = require("../../config/pool_conection");
const moment = require("moment");
const bcrypt = require('bcryptjs');


/*CADASTRO DO USUÁRIO 1 - PACIENTE*/



const usuarioModel = {
    createPac: async (dadosUsuarioPac) => {
        let connection;
        
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            // 1. Inserir na tabela usuarios
            const [resultUsuarios] = await connection.query(
                `INSERT INTO usuarios 
                (tipo_usuario, status_usuario, nome_usuario, email_usuario, cpf_usuario, senha_usuario, foto_usuario)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    '1', // tipo de usuário
                    '0', // status pendente
                    dadosUsuarioPac.nome_usuario,
                    dadosUsuarioPac.email_usuario,
                    dadosUsuarioPac.cpf_usuario,
                    dadosUsuarioPac.senha_usuario,
                    null // foto
                ]
            );

            if (!resultUsuarios.insertId) {
                throw new Error("Falha ao criar usuário");
            }

            const idUsuario = resultUsuarios.insertId;

            // 2. Formatar a data corretamente para o MySQL
            const dataNascimentoFormatada = moment(dadosUsuarioPac.dt_nasc_paciente, 'DD/MM/YYYY').format('YYYY-MM-DD');

            // 3. Inserir na tabela pacientes
            const [resultPacientes] = await connection.query(
                `INSERT INTO pacientes 
                (dt_nasc_paciente, logradouro_paciente, num_resid_paciente, complemento_paciente, bairro_paciente, cidade_paciente, uf_paciente, cep_paciente, id_usuario)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    dataNascimentoFormatada,
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

            // Commit da transação se tudo deu certo
            await connection.commit();

            return { 
                success: true,
                idUsuario: resultUsuarios.insertId,
                idPaciente: resultPacientes.insertId
            };

        } catch (error) {
            // Rollback em caso de erro
            if (connection) {
                await connection.rollback();
            }
            console.error("Erro no createPac:", error);
            throw error;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },



    findCampoCustomPac: async (criterioWhere) =>{
        try{
            const [resultados] = await pool.query(
                "select count(*) totalReg from usuarios where ?",
                [criterioWhere]
            )
                return resultados[0].totalReg;
            

        }catch(error){
            console.log(error);
            return error;
        }
    },

    /**Select no banco para buscar usuário pelo CPF */
    findCampoCustomCpf: async (criterioWhere) => {
        try{
            const [resultados] = await pool.query(
                "select count(*) totalReg from usuarios where ?",
                [criterioWhere]
            )
            return resultados[0].totalReg;
        }catch (error){
            console.log(error);
            return error;
        }
    },


    


    /**Select no banco para buscar o usuário pelo email */
    findUserEmail: async (dadosForm) => {
        try {
            const [resultados] = await pool.query(
                "SELECT * FROM usuarios WHERE email_usuario = ?",
                [dadosForm.email_usuario]
            )
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    /**Buscar dados completos do usuário para o perfil */
    findUserById: async (idUsuario) => {
        try {
            const [resultados] = await pool.query(
                `SELECT u.*, p.dt_nasc_paciente, p.logradouro_paciente, p.num_resid_paciente, 
                        p.complemento_paciente, p.bairro_paciente, p.cidade_paciente, p.uf_paciente, p.cep_paciente
                 FROM usuarios u 
                 LEFT JOIN pacientes p ON u.id_usuario = p.id_usuario 
                 WHERE u.id_usuario = ?`,
                [idUsuario]
            )
            return resultados[0];
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    /**Atualizar dados do usuário */
    updateUser: async (idUsuario, dadosUsuario) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            // Atualizar tabela usuarios
            let queryUsuarios = `UPDATE usuarios SET nome_usuario = ?, email_usuario = ?`;
            let paramsUsuarios = [dadosUsuario.nome, dadosUsuario.email];
            
            if (dadosUsuario.foto) {
                queryUsuarios += `, foto_usuario = ?`;
                paramsUsuarios.push(dadosUsuario.foto);
            }
            
            queryUsuarios += ` WHERE id_usuario = ?`;
            paramsUsuarios.push(idUsuario);
            
            await connection.query(queryUsuarios, paramsUsuarios);

            // Atualizar tabela pacientes
            const dataNascimentoFormatada = moment(dadosUsuario.dataNascimento, 'DD/MM/YYYY').format('YYYY-MM-DD');
            
            await connection.query(
                `UPDATE pacientes SET 
                 dt_nasc_paciente = ?, logradouro_paciente = ?, num_resid_paciente = ?, 
                 complemento_paciente = ?, bairro_paciente = ?, cidade_paciente = ?, 
                 uf_paciente = ?, cep_paciente = ?
                 WHERE id_usuario = ?`,
                [
                    dataNascimentoFormatada,
                    dadosUsuario.endereco,
                    dadosUsuario.numero,
                    dadosUsuario.complemento,
                    dadosUsuario.bairro,
                    dadosUsuario.cidade,
                    dadosUsuario.uf,
                    dadosUsuario.cep,
                    idUsuario
                ]
            );

            await connection.commit();
            return { success: true };

        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            console.error("Erro no updateUser:", error);
            throw error;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },

    
};





module.exports = usuarioModel;


