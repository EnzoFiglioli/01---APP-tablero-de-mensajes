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
             SELECT c.nombre as categoria, u.username, t.content, t.createdAt, u.avatar as avatar FROM Tweets t
            INNER JOIN Categoria c on t.categoria = id_categoria
            INNER JOIN Usuarios u on u.id_user = t.id_user
            ORDER BY t.createdAt DESC;
            `,{type: sequelize.QueryTypes.SELECT})

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
