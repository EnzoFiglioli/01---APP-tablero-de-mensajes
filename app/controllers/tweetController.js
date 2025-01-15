const {Usuario} = require("../models/Usuario.js");
const {Tweet}  = require("../models/Tweet.js");
const Categoria = require("../models/Categoria.js");

async function userActive(userId) {
    try {
        const user = await Usuario.findByPk(userId);
        if (!user) {
            throw new Error("Usuario no encontrado.");
        }
        return user;
    } catch (error) {
        console.error("Error en userActive:", error.message);
        throw error;
    }
}

async function crearTweet(req, res) {
    try {
        const { userId, content } = req.body;
        if (!userId || !content) {
            return res.status(400).json({ message: "Faltan datos necesarios." });
        }

        const user = await userActive(userId);

        const tweet = {
            userId: user.id,
            content: content,
            createdAt: new Date(),
        };

        return res.status(201).json({ message: "Tweet creado exitosamente.", tweet });
    } catch (error) {
        console.error("Error en crearTweet:", error.message);
        return res.status(500).json({ message: "Error al crear el tweet." });
    }
}

const obtenerTweets = async (req, res) => {
    try {
        const tweets = await Tweet.findAll(
        //     {
        //     include: [{
        //         model: Usuario,
        //         attributes: ['username', 'avatar'],
        //     },{
        //         model: Categoria,
        //         attributes: ['nombre']
        //     }],
        //     attributes: ['updatedAt', 'content'],
        // }
    );

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


module.exports = { userActive, crearTweet, obtenerTweets };
