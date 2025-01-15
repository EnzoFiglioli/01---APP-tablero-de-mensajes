const dotenv = require("dotenv");
const{ sequelize } = require("../config/sequelize.js");
const { DataTypes } = require("sequelize");

dotenv.config();

const avatar = process.env.AVATAR_DEFAULT;

const Usuario = sequelize.define('Usuario', {
    id_user: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true
    }, 
    name: {
        type: DataTypes.STRING(10),
        allowNull: false
    }, 
    lastname: {
        type: DataTypes.STRING(10),
        allowNull: false
    }, 
    email: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    avatar: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: avatar
    }
}, {
    tableName: 'Usuarios'
});

module.exports = {Usuario}