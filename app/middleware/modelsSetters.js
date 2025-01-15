const  {Tweet} = require("../models/Tweet.js");
const  {Usuario} = require("../models/Usuario.js");

function setModels(){
    Usuario.hasMany(Tweet, { foreignKey: 'id_user' });
    Tweet.belongsTo(Usuario, { foreignKey: 'id_user' });
}

module.exports = {setModels}