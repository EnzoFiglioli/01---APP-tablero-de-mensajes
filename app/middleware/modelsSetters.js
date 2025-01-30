const { Likes } = require("../models/Likes.js");
const  {Tweet} = require("../models/Tweet.js");
const  {Usuario} = require("../models/Usuario.js");


function setModels(){
    Likes.belongsTo(Tweet, { foreignKey: 'id_tweet', onDelete: 'CASCADE' });
    Tweet.hasMany(Likes, { foreignKey: 'id_tweet', onDelete: 'CASCADE' });

    Tweet.belongsTo(Usuario, { foreignKey: 'id_user', onDelete: 'CASCADE' });
    Usuario.hasMany(Tweet, { foreignKey: 'id_user', onDelete: 'CASCADE' });

    Likes.belongsTo(Usuario, { foreignKey: 'id_user', onDelete: 'CASCADE' });
    Usuario.hasMany(Likes, { foreignKey: 'id_user', onDelete: 'CASCADE' });
}

module.exports = {setModels}