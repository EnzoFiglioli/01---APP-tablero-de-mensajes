const { sequelize } = require("../config/sequelize");
const { Seguimientos } = require("../models/Seguimientos");

async function followingTweets(req, res) {
    const { username } = req.params;
    if (!username) {
        return res.status(400).json({ msg: "El nombre de usuario es requerido" });
    }

    try {
        const tweetSeguidos = await sequelize.query(
            `SELECT id_tweet, username, content, avatar, t.createdAt, categoria
            FROM Tweets t
            INNER JOIN Usuarios u ON u.id_user = t.id_user
            INNER JOIN Categoria c ON c.id_categoria = t.categoria
            INNER JOIN Seguimientos s ON s.id_seguidor = u.id_user
            WHERE s.id_seguidor = (SELECT id_user FROM Usuarios WHERE username = :username);`,
            { replacements: { username }, type: sequelize.QueryTypes.SELECT }
        );

        if (tweetSeguidos.length > 0) {
            return res.json(tweetSeguidos);
        }

        return res.status(404).json({ msg: "Probablemente no sigues a nadie" });

    } catch (error) {
        return res.status(500).json({ msg: "No se pudo traer los tweets de los seguidos. Intenta nuevamente más tarde." });
    }
}

module.exports = { followingTweets };
