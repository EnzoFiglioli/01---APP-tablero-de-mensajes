import {DataTypes} from "sequelize";
import {sequelize} from "../config/sequelize.js";

export const Categoria = sequelize.define('Categoria', {
    id_categoria: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(140),
        allowNull: true
    },
    tableName: 'Categoria'
});