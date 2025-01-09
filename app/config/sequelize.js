import dotenv from "dotenv";
import { Sequelize } from "sequelize";
dotenv.config();

const mysqlUri = process.env.MYSQL_ADDON_URI;
const sequelize = new Sequelize(mysqlUri, {
    dialect: "mysql",
    dialectModule: require("mysql2")
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

export { sequelize, connectDB };