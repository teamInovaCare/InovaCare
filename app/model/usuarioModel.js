const pool= require("../../config/pool_conection");



const usuarioModel = {
    create: async (dadosFormulario) => {
        let connection;/*é mais seguro usar o pool de forma explícita. Pq? Não sei. Mas é isso*/
        try {
            connection = await pool.getConnection();/**pega a conexãod de forma explícita */
            await connection.beginTransaction();

            
                    const [resultados] = await connection.query(
                `INSERT INTO usuarios 
                (tipo_usuario, status_usuario, nome_usuario, email_usuario, senha_usuario, cpf_usuario, foto_usuario) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    dadosFormulario.tipo || 'paciente',
                    dadosFormulario.status || 'ativo',
                    dadosFormulario.nome_usuario,
                    dadosFormulario.email_usuario,
                    dadosFormulario.senha_usuario,
                    dadosFormulario.cpf_usuario,
                    dadosFormulario.foto_usuario
                ]
            );

            
            if ((dadosFormulario.tipo || 'paciente') === 'paciente') {
                await connection.query(
                    `INSERT INTO pacientes 
                    (dt_nasc_paciente, logradouro_paciente, bairro_paciente, cidade_paciente, uf_paciente, complemento, cep, fk_id_usuario) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        dadosFormulario.dt_nasc_paciente,
                        dadosFormulario.logradouro_paciente,
                        dadosFormulario.bairro_paciente,
                        dadosFormulario.cidade_paciente,
                        dadosFormulario.uf_paciente,
                        dadosFormulario.complemento,
                        dadosFormulario.cep,
                        resultados.insertId 
                    ]
                );
            }

            await connection.commit();
            return resultados;

        } catch (erro) {
            if (connection) await connection.rollback();
            console.error('Erro no model:', erro);
            throw erro; // Propaga o erro para o controller
        } finally {
            if (connection) connection.release();/*libera o pool- evita que osistema trava*/
        }
    }
};

module.exports= usuarioModel;


