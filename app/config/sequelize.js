const dotenv = require("dotenv");
const { Sequelize } = require("sequelize");
dotenv.config();
const mysql = require("mysql2");

const mysqlUri = process.env.MYSQL_ADDON_URI;
const sequelize = new Sequelize(mysqlUri, {
    dialect: "mysql",
    dialectModule: mysql,
    pool:{
        max:10,
        min:0,
        acquire:30000,
        idle:10000  
    }
});

async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log("Conexión a la base de datos MySQL establecida correctamente.");
    } catch (err) {
        console.error("Error al conectar a la base de datos:", err);
        throw err;
    }
}

module.exports = { sequelize, connectDB };