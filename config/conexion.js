const mysql = require("mysql");

const db = mysql.createConnection({
    host:process.env.HOSTDB || "localhost",
    user: process.env.USERDB || "root",
    password: process.env.PASSWORDDB || "",
    database: process.env.DB || "Proyectoo",
    port: process.env.PORTDB || 8081
});

db.connect(err => {

    if (err) {
        
        console.log(`Error al conectarse con la base de datos: ${err}`);
        
    } else{

        console.log("Base de datos conectada con exito");
        
    }
});

module.exports = db;
