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