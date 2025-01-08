import dotenv from "dotenv";
import {sequelize} from "../config/sequelize.js";
import {DataTypes} from "sequelize";
dotenv.config();
const avatar = process.env.AVATAR_DEFAULT;

export const Tweet = sequelize.define('Tweet', {
    id_tweet: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_user: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        references: {
            model: 'Usuario',
            key: 'id_user'
        }
    }, 
    content: {
        type: DataTypes.TEXT(),
        allowNull: false
    },
    categoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categoria',
            key: 'id_categoria'
        }
    },
    image: {
        type: DataTypes.STRING(140),
        allowNull: true 
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    tableName: 'Tweet',
});