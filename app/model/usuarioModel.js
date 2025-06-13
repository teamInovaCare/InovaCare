const pool= require("../../config/pool_conection");
const bcrypt = require('bcryptjs');


/*CADASTRO DO USUÁRIO 1 - PACIENTE*/

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
    },

    /**LOGIN DO USUÁRIO 1- PACIENTE */


    /*const usuarioModel = {
    //metodo para retornar todo os registros da entidade usuario
    findAll: async () => {
        try {
            const [resultados, estrutura] = await
                pool.query("SELECT * FROM usuario u, tipo_usuario t " +
                    + " where t.id_tipo_usuario = u.tipo_usuario and u.status_usuario =1;");
            console.log(resultados);
            console.log(estrutura);
            return resultados;
        } catch (erro) {
            console.log(erro);
            return false;
        }

    },*/


    /**findId: async (id) => {
        try {
            const [linhas,campos] = await pool.query('SELECT * FROM tarefas WHERE status_tarefa = 1 and id_tarefa = ?',[id] )
            return linhas;
        } catch (error) {
            return error;
        }
    }, */


    selectusermail: async(email_usuario, senha_digitada)=>{
        try{
            const[usuarios]= await pool.query('select id_usuario, senha_usuario from usuarios where email_usuario = ? ', [email_usuario]);
            
            if(usuarios.length === 0){/**Verifica se o email existe no array criado - método lenght */
                return {success:false, message: 'Usuário não encontrado'};
            }

            const usuario = usuarios[0];/**percorre o array e pega o primeiro resultado encontrado */
            const senhaCorreta = await bcrypt.compare(senha_digitada, usuario.senha_usuario);/**Uso o bcrypt.compare para comparar a senha digitada pelo usuário com a senha armazenada no hash no meu banco --- pq a senha está criptografada */

            if(!senhaCorreta){/**o contrário - se não é senha correta */
                return{success: false, message:'Senha incorreta'};
            }

            return {
                success: true,
                message: 'Login realizado com sucesso',
                user: {id: usuario.id_usuario, email: email_usuario}
            }

        }catch(error){
            console.log(error)
            return {success:false, message: 'Erro durante o login'};
        }
    }

    
};





module.exports= usuarioModel;


