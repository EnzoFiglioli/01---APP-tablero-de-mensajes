const { sequelize } = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const Seguimientos = sequelize.define(
  "Seguimientos",
  {
    id_seguido: {
      type: DataTypes.INTEGER, 
      allowNull: false,        
      references: {
        model: "Usuarios",    
        key: "id_usuario",    
      },
      onUpdate: "CASCADE",    
      onDelete: "CASCADE",
    },
    id_seguidor: {
      type: DataTypes.INTEGER,
      allowNull: false,       
      references: {
        model: "Usuarios",    
        key: "id_usuario",    
      },
      onUpdate: "CASCADE",    
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: true,         
    tableName: "Seguimientos",
  }
);

module.exports = { Seguimientos };
