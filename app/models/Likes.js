const {sequelize} = require("../config/sequelize.js");
const {DataTypes} = require("sequelize");
const {Usuario} = require("./Usuario.js");
const {Tweet} = require("./Tweet.js");

const Likes = sequelize.define('Likes', {
    id_like: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_tweet: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.NOW,
        defaultValue: DataTypes.NOW
    },
    updateAt: {
        type: DataTypes.NOW,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    }
    }, {
      tableName: 'Likes',
      timestamps: false,
});
  
Likes.belongsTo(Usuario, {
  foreignKey: 'id_user',
    as: 'usuario',
  });
  
Likes.belongsTo(Tweet, {
  foreignKey: 'id_tweet',
    as: 'tweet',
});
  
    module.exports = {Likes};