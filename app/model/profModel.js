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
                [num_registro_especialista, id_especialidade]
            )
            return resultados[0].totalReg;

        } catch (error) {
            console.log(error);
            return error;
        }
    },




    /**Select no banco para buscar o usuário pelo email */
    findUserEmailPac: async (camposForm) => {


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


    /**Select na tabela a partir do id_usuario para encontrar o id_especialista */
    selectIdEspecialista: async (req) => {

        try {

            const [resultados] = await pool.query(
                `select id_especialista
                from usuarios
                inner join especialistas
                on especialistas.id_usuario = usuarios.id_usuario
                where usuarios.id_usuario = ? `,

                [req.session.autenticado.id]
            )
            return resultados[0]?.id_especialista;

        } catch (error) {
            console.log(error)
            return error;
        }

    },

    /**Insert na agenda do profissional */

    configAgendaProf: async (dadosAgenda, pausas) => {

        let connection;

        try {

            /**Transação para inserir nas tabelas apenas se houver sucesso */

            connection = await pool.getConnection();
            await connection.beginTransaction();

            const [resultadosAgenda] = await connection.query(
                `insert into disponibilidade_especialista (dia_semana, hr_inicio, hr_fim, tipo_atendimento, duracao_consulta, preco_base, taxa_locomocao, id_especialista)
                    values(?,?,?,?,?,?,?,? )`,
                [
                    dadosAgenda.dia_semana,
                    dadosAgenda.hr_inicio,
                    dadosAgenda.hr_fim,
                    dadosAgenda.tipo_atendimento,
                    dadosAgenda.duracao_consulta,
                    dadosAgenda.preco_base,
                    dadosAgenda.taxa_locomocao,
                    dadosAgenda.id_especialista

                ]
            );

            if (!resultadosAgenda.insertId) {
                throw new Error("Falha ao criar agenda");
            }

            const idDisponibilidade = resultadosAgenda.insertId;


            let idPausas = [];
            /**Verifico as pausas
             * 
             * Se pausas for um array e tiver pelo menos 1 elemento eu executo:*/
            if (Array.isArray(pausas) && pausas.length > 0) {

                //para cada pausa dentro do PAUSAS (VIA JS, eu faço uma inserção)
                for (const pausa of pausas) {

                    //Se não houverem campos vazios, eu faço:
                    if (pausa.pausa_inicio && pausa.pausa_fim) {
                        const [resultadosPausa] = await connection.query(
                            `INSERT INTO pausa (id_disponibilidade_especialista, hr_inicio_pausa, hr_fim_pausa)
                            VALUES (?, ?, ?)`,
                            [idDisponibilidade, pausa.pausa_inicio, pausa.pausa_fim]
                        );

                        // Armazena o ID gerado dessa pausa
                        idPausas.push(resultadosPausa.insertId);
                    }
                }
            }


            // Commit da transação se tudo deu certo
            await connection.commit();

            return {
                success: true,
                id_disponibilidade: idDisponibilidade,
                id_pausa: idPausas
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


    /**Aplicar o filtro para uma agenda específica */
    findFiltroProf: async (id_especialista, semanadia) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM disponibilidade_especialista WHERE id_especialista = ? and '
                + ' dia_semana = ?', [id_especialista, semanadia])
            return linhas;
        } catch (error) {

            console.error("Erro ao buscar as agendas filtradas:", error)
            throw error;
        }
    },


    /**Mostrar todas as agendas */
    findAllFiltroProf: async (id_especialista) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM disponibilidade_especialista WHERE id_especialista = ?',
                [id_especialista])

            return linhas;

        } catch (error) {
            console.error("Erro ao buscar todas as agendas:", error)
            throw error;
        }
    },

    findPausa: async (id_disponibilidade) => {
  try {
    const [linhas] = await pool.query(
      `SELECT hr_inicio_pausa, hr_fim_pausa 
       FROM pausa
       WHERE id_disponibilidade_especialista = ?`,
      [id_disponibilidade]
    );
    return linhas;
  } catch (error) {
    console.error("Erro ao buscar pausas:", error);
    throw error;
  }
},


};




module.exports = profModel;





