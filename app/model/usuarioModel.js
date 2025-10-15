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
                `SELECT u.id_usuario, u.tipo_usuario, u.status_usuario, u.nome_usuario, u.email_usuario, 
                        u.cpf_usuario, u.senha_usuario, u.foto_usuario,
                        p.dt_nasc_paciente, p.logradouro_paciente, p.num_resid_paciente, 
                        p.complemento_paciente, p.bairro_paciente, p.cidade_paciente, p.uf_paciente, p.cep_paciente,
                        p.id_paciente,
                        e.*,
                        esp.NOME_ESPECIALIDADE, esp.TIPO_REGISTRO
                 FROM usuarios u 
                 LEFT JOIN pacientes p ON u.id_usuario = p.id_usuario 
                 LEFT JOIN especialistas e ON u.id_usuario = e.id_usuario
                 LEFT JOIN especialidades esp ON e.ID_ESPECIALIDADE = esp.ID_ESPECIALIDADE
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
            let queryUsuarios = `UPDATE usuarios SET nome_usuario = ?, email_usuario = ?, cpf_usuario = ?`;
            let paramsUsuarios = [dadosUsuario.nome, dadosUsuario.email, dadosUsuario.cpf];
            
            if (dadosUsuario.hasOwnProperty('foto')) {
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

    /**Buscar especialistas por tipo de atendimento e especialidade */
    findEspecialistas: async (tipo_atendimento, nome_especialidade) => {
        try {
            const [resultados] = await pool.query(
                `SELECT nome_usuario, tipo_registro, nome_especialidade, cidade_local, tipo_atendimento FROM usuarios
                INNER JOIN especialistas ON usuarios.id_usuario = especialistas.id_usuario
                INNER JOIN disponibilidade_especialista ON disponibilidade_especialista.id_especialista = especialistas.id_especialista
                INNER JOIN especialidades ON especialidades.id_especialidade = especialistas.id_especialidade
                INNER JOIN especialista_local ON especialista_local.id_especialista = especialistas.id_especialista
                INNER JOIN locais ON locais.id_local = especialista_local.id_local
                WHERE tipo_atendimento = ? AND nome_especialidade = ?
                GROUP BY nome_usuario`,
                [tipo_atendimento, nome_especialidade]
            );
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    /**Buscar especialistas por cidade e especialidade */
    findEspecialistasByCidadeEspecialidade: async (cidade_local, nome_especialidade) => {
        try {
            const [resultados] = await pool.query(
                `SELECT nome_usuario, nome_especialidade, tipo_registro, num_registro_especialista, cidade_local
                 FROM especialistas
                 INNER JOIN usuarios ON usuarios.id_usuario = especialistas.id_usuario
                 INNER JOIN especialidades ON especialidades.id_especialidade = especialistas.id_especialidade
                 INNER JOIN especialista_local ON especialista_local.id_especialista = especialistas.id_especialista
                 INNER JOIN locais ON locais.id_local = especialista_local.id_local
                 WHERE cidade_local = ? AND nome_especialidade = ?
                 GROUP BY nome_usuario`,
                [cidade_local, nome_especialidade]
            );
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    /**Buscar especialistas por nome de usuário e especialidade */
    findEspecialistasByNomeEspecialidade: async (nome_usuario, nome_especialidade) => {
        try {
            const [resultados] = await pool.query(
                `SELECT nome_usuario, nome_especialidade, tipo_registro, num_registro_especialista, cidade_local
                 FROM especialistas
                 INNER JOIN usuarios ON usuarios.id_usuario = especialistas.id_usuario
                 INNER JOIN especialidades ON especialidades.id_especialidade = especialistas.id_especialidade
                 INNER JOIN especialista_local ON especialista_local.id_especialista = especialistas.id_especialista
                 INNER JOIN locais ON locais.id_local = especialista_local.id_local
                 WHERE nome_usuario = ? AND nome_especialidade = ?`,
                [nome_usuario, nome_especialidade]
            );
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    /**Buscar informações médicas do paciente */
    findInfoMedica: async (idPaciente) => {
        try {
            const [resultados] = await pool.query(
                `SELECT * FROM informacao_paciente WHERE id_paciente = ?`,
                [idPaciente]
            );
            return resultados[0] || null;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    /**Criar ou atualizar informações médicas do paciente */
    upsertInfoMedica: async (idPaciente, dadosMedicos) => {
        try {
            console.log('upsertInfoMedica - ID Paciente:', idPaciente);
            console.log('upsertInfoMedica - Dados recebidos:', dadosMedicos);
            
            // Verificar se já existe registro
            const infoExistente = await usuarioModel.findInfoMedica(idPaciente);
            console.log('upsertInfoMedica - Info existente:', infoExistente);
            
            if (infoExistente) {
                // Atualizar registro existente
                console.log('upsertInfoMedica - Atualizando registro existente');
                const [resultado] = await pool.query(
                    `UPDATE informacao_paciente SET 
                     diagnostico_paciente = ?, medicamento_cont = ?, alergia = ?, cirurgia = ?
                     WHERE id_paciente = ?`,
                    [
                        dadosMedicos.diagnostico,
                        dadosMedicos.medicamentoContinuo,
                        dadosMedicos.alergias,
                        dadosMedicos.cirurgia,
                        idPaciente
                    ]
                );
                console.log('upsertInfoMedica - Resultado UPDATE:', resultado);
                return { success: true, updated: true };
            } else {
                // Criar novo registro
                console.log('upsertInfoMedica - Criando novo registro');
                const [resultado] = await pool.query(
                    `INSERT INTO informacao_paciente 
                     (diagnostico_paciente, medicamento_cont, alergia, cirurgia, id_paciente)
                     VALUES (?, ?, ?, ?, ?)`,
                    [
                        dadosMedicos.diagnostico,
                        dadosMedicos.medicamentoContinuo,
                        dadosMedicos.alergias,
                        dadosMedicos.cirurgia,
                        idPaciente
                    ]
                );
                console.log('upsertInfoMedica - Resultado INSERT:', resultado);
                return { success: true, created: true, id: resultado.insertId };
            }
        } catch (error) {
            console.log('upsertInfoMedica - ERRO:', error);
            throw error;
        }
    },


    findMedicoFiltro: async (cidade_local, nome_especialidade, nome_usuario, tipo_atendimento) => {
  try {
    let query = `
      SELECT usuarios.id_usuario, nome_usuario, usuarios.foto_usuario, especialistas.id_especialista, num_registro_especialista, especialidades.id_especialidade, cidade_local, tipo_atendimento, preco_base, taxa_locomocao 
      FROM usuarios
      INNER JOIN especialistas ON usuarios.id_usuario = especialistas.id_usuario
      INNER JOIN disponibilidade_especialista ON disponibilidade_especialista.id_especialista = especialistas.id_especialista
      INNER JOIN especialidades ON especialidades.id_especialidade = especialistas.id_especialidade
      INNER JOIN especialista_local ON especialista_local.id_especialista = especialistas.id_especialista
      INNER JOIN locais ON locais.id_local = especialista_local.id_local
      WHERE 1 = 1
    `;

    const params = [];

    if (cidade_local) {
      query += ` AND cidade_local = ?`;
      params.push(cidade_local);
    }

    if (nome_especialidade) {
      query += ` AND especialistas.id_especialidade = ?`;
      params.push(nome_especialidade);
    }

    if (nome_usuario) {
      query += ` AND UPPER(nome_usuario) LIKE ?`;
      params.push(`%${nome_usuario.toUpperCase()}%`);
    }

    if (tipo_atendimento) {
      query += ` AND tipo_atendimento = ?`;
      params.push(tipo_atendimento);
    }

    const [resultado] = await pool.query(query, params);
    
    // Processar fotos para base64
    resultado.forEach(medico => {
      if (medico.foto_usuario && Buffer.isBuffer(medico.foto_usuario)) {
        medico.foto_usuario = `data:image/jpeg;base64,${medico.foto_usuario.toString('base64')}`;
      }
    });
    
    return { success: true, data: resultado };

  } catch (error) {
    console.log(error);
    throw error;
  }
},

    /**Atualizar dados do especialista */
    updateEspecialista: async (idUsuario, dadosEspecialista) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            // Atualizar tabela usuarios
            let queryUsuarios = `UPDATE usuarios SET nome_usuario = ?, email_usuario = ?, cpf_usuario = ?`;
            let paramsUsuarios = [dadosEspecialista.nome, dadosEspecialista.email, dadosEspecialista.cpf];
            
            if (dadosEspecialista.hasOwnProperty('foto')) {
                queryUsuarios += `, foto_usuario = ?`;
                paramsUsuarios.push(dadosEspecialista.foto);
            }
            
            queryUsuarios += ` WHERE id_usuario = ?`;
            paramsUsuarios.push(idUsuario);
            
            await connection.query(queryUsuarios, paramsUsuarios);

            // Atualizar tabela especialistas
            const dataNascimentoFormatada = moment(dadosEspecialista.dataNascimento, 'DD/MM/YYYY').format('YYYY-MM-DD');
            
            let queryEspecialista = `UPDATE especialistas SET 
                 dt_nasc_especialista = ?, logradouro_especialista = ?, num_resid_especialista = ?, 
                 complemento_especialista = ?, bairro_especialista = ?, cidade_especialista = ?, 
                 uf_especialista = ?, cep_especialista = ?`;
            
            let paramsEspecialista = [
                dataNascimentoFormatada,
                dadosEspecialista.endereco,
                dadosEspecialista.numero,
                dadosEspecialista.complemento,
                dadosEspecialista.bairro,
                dadosEspecialista.cidade,
                dadosEspecialista.uf,
                dadosEspecialista.cep
            ];
            
            if (dadosEspecialista.especialidade) {
                queryEspecialista += `, id_especialidade = ?`;
                paramsEspecialista.push(dadosEspecialista.especialidade);
            }
            
            queryEspecialista += ` WHERE id_usuario = ?`;
            paramsEspecialista.push(idUsuario);
            
            await connection.query(queryEspecialista, paramsEspecialista);

            await connection.commit();
            return { success: true };

        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            console.error("Erro no updateEspecialista:", error);
            throw error;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },

    /**Buscando a agenda para gerar as datas - dias da semana*/
    Selectagenda: async (idEspecialista, tipoAtendimento) => {
        try {
          const [rows] = await pool.query(
            `SELECT id_disponibilidade_especialista, dia_semana, tipo_atendimento
             FROM disponibilidade_especialista
             WHERE id_especialista = ?
             AND tipo_atendimento = ?`,
            [idEspecialista, tipoAtendimento]
          );
          return rows;
        } catch (error) {
          console.error('Erro ao buscar agenda:', error);
          throw error;
        }
      },

    /**Buscar informações profissionais do especialista */
    findInfoEspecialista: async (idEspecialista) => {
        try {
            const [resultados] = await pool.query(
                `SELECT ie.linkddin_especialista, ie.formacao_especialista,
                        GROUP_CONCAT(l.cidade_local) as regioes_atendimento
                 FROM informacao_especialista ie
                 LEFT JOIN especialista_local el ON ie.id_especialista = el.id_especialista
                 LEFT JOIN locais l ON el.id_local = l.id_local
                 WHERE ie.id_especialista = ?
                 GROUP BY ie.id_info_especialista`,
                [idEspecialista]
            );
            return resultados[0] || null;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    /**Criar ou atualizar informações profissionais do especialista */
    upsertInfoEspecialista: async (idEspecialista, dadosProfissionais) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            // Verificar se já existe registro
            const [infoExistente] = await connection.query(
                `SELECT id_info_especialista FROM informacao_especialista WHERE id_especialista = ?`,
                [idEspecialista]
            );

            if (infoExistente.length > 0) {
                // Atualizar registro existente
                await connection.query(
                    `UPDATE informacao_especialista SET 
                     linkddin_especialista = ?, formacao_especialista = ?
                     WHERE id_especialista = ?`,
                    [
                        dadosProfissionais.linkedin,
                        dadosProfissionais.formacao,
                        idEspecialista
                    ]
                );
            } else {
                // Criar novo registro
                await connection.query(
                    `INSERT INTO informacao_especialista 
                     (linkddin_especialista, formacao_especialista, id_especialista)
                     VALUES (?, ?, ?)`,
                    [
                        dadosProfissionais.linkedin,
                        dadosProfissionais.formacao,
                        idEspecialista
                    ]
                );
            }

            // Atualizar regiões de atendimento
            if (dadosProfissionais.regioes && dadosProfissionais.regioes.length > 0) {
                // Remover regiões existentes
                await connection.query(
                    `DELETE FROM especialista_local WHERE id_especialista = ?`,
                    [idEspecialista]
                );

                // Inserir novas regiões
                for (const regiao of dadosProfissionais.regioes) {
                    // Buscar ou criar a cidade
                    let [cidadeExistente] = await connection.query(
                        `SELECT id_local FROM locais WHERE cidade_local = ?`,
                        [regiao]
                    );

                    let idLocal;
                    if (cidadeExistente.length > 0) {
                        idLocal = cidadeExistente[0].id_local;
                    } else {
                        const [novaCidade] = await connection.query(
                            `INSERT INTO locais (cidade_local) VALUES (?)`,
                            [regiao]
                        );
                        idLocal = novaCidade.insertId;
                    }

                    // Inserir relação especialista-local
                    await connection.query(
                        `INSERT INTO especialista_local (id_especialista, id_local) VALUES (?, ?)`,
                        [idEspecialista, idLocal]
                    );
                }
            }

            await connection.commit();
            return { success: true };

        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            console.error('Erro no upsertInfoEspecialista:', error);
            throw error;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },

    /**Buscar dados completos do especialista por ID para perfil público */
    findEspecialistaById: async (idUsuario) => {
        try {
            const [resultados] = await pool.query(
                `SELECT u.nome_usuario, u.foto_usuario, 
                        e.num_registro_especialista, e.id_especialista,
                        esp.nome_especialidade, esp.tipo_registro
                 FROM usuarios u
                 INNER JOIN especialistas e ON u.id_usuario = e.id_usuario
                 INNER JOIN especialidades esp ON e.id_especialidade = esp.id_especialidade
                 WHERE u.id_usuario = ?`,
                [idUsuario]
            );
            
            if (resultados[0]) {
                // Tratar foto_usuario para base64 se existir
                if (resultados[0].foto_usuario && Buffer.isBuffer(resultados[0].foto_usuario)) {
                    resultados[0].foto_usuario = `data:image/jpeg;base64,${resultados[0].foto_usuario.toString('base64')}`;
                }
            }
            
            return resultados[0] || null;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    /**Buscar informações profissionais completas do especialista */
    findInfoEspecialistaCompleta: async (idEspecialista) => {
        try {
            const [resultados] = await pool.query(
                `SELECT ie.linkddin_especialista, ie.formacao_especialista,
                        GROUP_CONCAT(l.cidade_local) as regioes_atendimento
                 FROM informacao_especialista ie
                 LEFT JOIN especialista_local el ON ie.id_especialista = el.id_especialista
                 LEFT JOIN locais l ON el.id_local = l.id_local
                 WHERE ie.id_especialista = ?
                 GROUP BY ie.id_info_especialista`,
                [idEspecialista]
            );
            return resultados[0] || null;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    /**Buscar avaliações do especialista */
    findAvaliacoes: async (idEspecialista) => {
        try {
            const [resultados] = await pool.query(
                `SELECT a.id_avaliacao, a.nota, a.comentario, a.data_avaliacao,
                        u.nome_usuario as nome_paciente, u.id_usuario
                 FROM avaliacoes a
                 INNER JOIN pacientes p ON a.id_paciente = p.id_paciente
                 INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
                 WHERE a.id_especialista = ?
                 ORDER BY a.data_avaliacao DESC`,
                [idEspecialista]
            );
            return resultados;
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    /**Calcular média das avaliações */
    calcularMediaAvaliacoes: async (idEspecialista) => {
        try {
            const [resultado] = await pool.query(
                `SELECT AVG(nota) as media, COUNT(*) as total
                 FROM avaliacoes
                 WHERE id_especialista = ?`,
                [idEspecialista]
            );
            return {
                media: resultado[0].media ? parseFloat(resultado[0].media).toFixed(1) : 0,
                total: resultado[0].total
            };
        } catch (error) {
            console.log(error);
            return { media: 0, total: 0 };
        }
    },

    /**Criar nova avaliação */
    criarAvaliacao: async (dadosAvaliacao) => {
        try {
            const [resultado] = await pool.query(
                `INSERT INTO avaliacoes (id_paciente, id_especialista, nota, comentario, data_avaliacao)
                 VALUES (?, ?, ?, ?, NOW())`,
                [
                    dadosAvaliacao.idPaciente,
                    dadosAvaliacao.idEspecialista,
                    dadosAvaliacao.nota,
                    dadosAvaliacao.comentario
                ]
            );
            return { success: true, id: resultado.insertId };
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    /**Atualizar avaliação existente */
    atualizarAvaliacao: async (idAvaliacao, dadosAvaliacao) => {
        try {
            const [resultado] = await pool.query(
                `UPDATE avaliacoes SET nota = ?, comentario = ? WHERE id_avaliacao = ?`,
                [dadosAvaliacao.nota, dadosAvaliacao.comentario, idAvaliacao]
            );
            return { success: true, affectedRows: resultado.affectedRows };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }


};





module.exports = usuarioModel;


