const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/sequelize.js")

const Notification = sequelize.define("Notification",{
    id_notification: {
        type: DataTypes.NUMBER,
        primaryKey:true,
        autoIncrement:true
    },
    id_user_recepto:{
        type:DataTypes.NUMBER,
        references:{
            model:"Usuarios",
            key:"id_user"
        }
    },
    isLike:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    isFollow:{
        type: DataTypes.BOOLEAN,
        defaultValue:false
    }
},{
    tableName:"Notification",
    timestamps:true
})