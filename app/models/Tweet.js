const dotenv = require("dotenv");
const { DataTypes } = require( "sequelize");
const { sequelize } = require( "../config/sequelize.js");

dotenv.config();
const avatar = process.env.AVATAR_DEFAULT;

const Tweet = sequelize.define('Tweet', {
    id_tweet: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuarios', // Nombre de la tabla de Usuarios en plural
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
        defaultValue: sequelize.NOW, // Esto establece la fecha de creación automáticamente
        allowNull: false
    }
}, {
    tableName: "Tweet"
});

module.exports = {Tweet}