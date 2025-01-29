const {Usuario} = require("../models/Usuario.js");
const {Tweet}  = require("../models/Tweet.js");
const Categoria = require("../models/Categoria.js");
const { sequelize } = require("../config/sequelize.js");
const jwt = require("jsonwebtoken")

async function crearTweet(req, res) {
    try {
        const userActive = req.user.id;
        if (!userActive) {
            return res.status(401).json({ message: "Usuario no autenticado." });
        }

        const { content, categoria } = req.body;

        // Validar el contenido
        if (!content || typeof content !== "string" || content.trim() === "") {
            return res.status(400).json({ message: "Faltan datos necesarios o contenido inválido." });
        }

        // Crear el tweet de forma segura
        const tweet = await sequelize.query(
            "INSERT INTO Tweets (id_user, content, categoria, image) VALUES (?, ?, ?, ?);",
            {
                replacements: [userActive, content.trim(), categoria, ""],
                type: sequelize.QueryTypes.INSERT,
            }
        );

        if (tweet) {
            return res.status(201).json({ message: "Tweet creado exitosamente.", tweet });
        }

        return res.status(400).json({ message: "Error al crear el tweet." });
    } catch (error) {
        console.error("Error en crearTweet:", error.message);
        return res.status(500).json({ message: "Error interno al crear el tweet." });
    }
}

const obtenerTweets = async (req, res) => {
    try {
        const tweets = await sequelize.query(`
             SELECT t.id_tweet, c.nombre as categoria, u.username, t.content, t.createdAt, u.avatar as avatar FROM Tweets t
            INNER JOIN Categoria c on t.categoria = id_categoria
            INNER JOIN Usuarios u on u.id_user = t.id_user
            ORDER BY t.createdAt DESC;
            `,{type: sequelize.QueryTypes.SELECT})

        if (tweets.length > 0) {
            const tweetsList = tweets.map((i)=>(
                {
                    createdAt : i.createdAt,
                    id_tweet: i.id_tweet,
                    categoria: i.categoria,
                    username: i.username,
                    content: i.content,
                    avatar: i.avatar
                }));
            return res.json(tweetsList);
        } else {
            return res.status(204).json({ msg: "No se encontraron tweets, sé el primero." });
        }
    } catch (error) {
        console.error("Error al obtener los tweets:", error);
        return res.status(500).json({ message: "Error al obtener los tweets." });
    }
};

const hashtagsTweets = async (req,res) => {
    try{
        const tweets = (await sequelize.query("SELECT content from Tweets WHERE content LIKE '%#%';",{type:sequelize.QueryTypes.SELECT})).flat();
        const regex = /#\w+/g;
        const hashtags = [];
        
        if(tweets){
            tweets.forEach((contenido)=>{      
                const msg = contenido.content;
                const result = msg.match(regex);
                hashtags.push(result)
            });
            res.json(hashtags);
        }else{
            res.status(404).json({msg:"Aún no hay ningún hashtag."});
        }        
    }catch{
        res.status(500).json({msg:"Error al intentar traer los hashtags"});
    }
}

const eliminarTweet = async (req,res)=>{
    try{
        const id = req.params.id;
        const query = sequelize.query(`DELETE FROM Tweets WHERE id_tweet = ${id}`);
        console.log(query);
        if(query) return res.status(201).json({msg:"Mensaje elimnado correctamente"});
        res.status(404).json({msg:"Error al encontrar tweet con ese id"});
    }catch(err){
        console.log({err});
        res.status(500).json({msg:"No se pudo eliminar tweet, error en el server."});
    }
}

const obtenerTweetsID = async(req,res)=>{
    try{
        const username = req.params.username;
        const query = await sequelize.query(`SELECT t.id_tweet, c.nombre as categoria, u.username, t.content, t.createdAt, u.avatar as avatar FROM Tweets t
            INNER JOIN Categoria c on t.categoria = id_categoria
            INNER JOIN Usuarios u on u.id_user = t.id_user
            WHERE u.username = "${username}"
            ORDER BY t.createdAt DESC;`,{type:sequelize.QueryTypes.SELECT});
            if (query.length > 0) {
                const tweetsList = query.map((i)=>(
                    {
                        createdAt : i.createdAt,
                        id_tweet: i.id_tweet,
                        categoria: i.categoria,
                        username: i.username,
                        content: i.content,
                        avatar: i.avatar
                    }));
                return res.json(tweetsList);
            }
        res.status(404).json({msg:`No se encontro ningun usuario con el nombre ${username}`});
    }catch(err){
        console.log(err);
        res.status(500).json({msg:`Error interno al obtener tweets para el usuario: ${err}`});
    }
}

module.exports = { crearTweet, obtenerTweets, hashtagsTweets, eliminarTweet, obtenerTweetsID };
