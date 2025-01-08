import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";

const sequelize = new Sequelize ({
        dialect: "sqlite",
        storage: "./database.sqlite"
    }
);

function connectDB() {
    try{
        const conn = sequelize.authenticate();
        sequelize.sync();
        console.log("Connection has been established successfully.");
        return conn;
    }catch(err){
        console.log("Error: ", err);
        throw err;
    }
}

export { sequelize, connectDB };