process.loadEnvFile();
import { Sequelize } from "sequelize";

const sequelize = new Sequelize ({
        dialect: "sqlite",
        storage: process.env.DB_PATH
    }
);

function connectDB() {
    try{
        const conn = sequelize.authenticate();
        console.log("Connection has been established successfully.");
        return conn;
    }catch(err){
        console.log("Error: ", err);
        throw err;
    }
}

export { sequelize, connectDB };