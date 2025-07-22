var mysql= require("mysql2");


const pool = mysql.createPool({
    host: process.env.host_db, 
    user: process.env.user_db, 
    password: process.env.password_db,
    database: process.env.database_db,
    port: process.env.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, conn) => {
    if(err) 
        console.log(err)
    else
        console.log("Conectado ao SGBD!")
})

module.exports = pool.promise()


/*ESTAMOS CONECTADOS!!! REPITO: ESTAMOS CONECTADOS!!!*/ 


/*const mysql = require('mysql2')

try {
    var pool = mysql.createConnection({
        host: process.env.host_db, 
        user: process.env.user_db, 
        password: process.env.password_db,
        database: process.env.database_db,
        port: process.env.port,
    });
    console.log("Conexão estabelecida!");
} catch (e) {
    console.log("Falha ao estabelecer a conexão!");
    console.log(e);
}
 
module.exports = pool.promise();*/