const {Usuario} = require("../models/Usuario.js");
const {Tweet}  = require("../models/Tweet.js");
const Categoria = require("../models/Categoria.js");
const { sequelize } = require("../config/sequelize.js");


async function crearTweet(req, res) {
    try {
        const userActive = req.cookies("token");
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ message: "Faltan datos necesarios." });
        }

        const tweet = 
            `INSERT INTO Tweets(id_usuario,content,categoria,image)VALUES(${userActive},${content},4,"");`; 
            const tweeteando = await sequelize.query(tweet);
            if(tweeteando){
                return res.status(201).json({ message: "Tweet creado exitosamente.", tweet });
            }
        return res.status(400).json({msg:"Erro al tweetear"})

    } catch (error) {
        console.error("Error en crearTweet:", error.message);
        return res.status(500).json({ message: "Error al crear el tweet." });
    }
}

const obtenerTweets = async (req, res) => {
    try {
        const tweets = await sequelize.query(`
             SELECT c.nombre as categoria, u.username, t.content, t.createdAt, u.avatar as avatar FROM Tweets t
            INNER JOIN Categoria c on t.categoria = id_categoria
            INNER JOIN Usuarios u on u.id_user = t.id_user;
            `)

        if (tweets.length > 0) {
            return res.json(tweets);
        } else {
            return res.status(204).json({ msg: "No se encontraron tweets, sé el primero." });
        }
    } catch (error) {
        console.error("Error al obtener los tweets:", error);
        return res.status(500).json({ message: "Error al obtener los tweets." });
    }
};


module.exports = { crearTweet, obtenerTweets };
