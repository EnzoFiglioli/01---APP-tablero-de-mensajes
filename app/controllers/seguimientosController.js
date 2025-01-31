const { sequelize } = require("../config/sequelize");
const { Seguimientos } = require("../models/Seguimientos");
const { Usuario } = require("../models/Usuario.js");

async function followingTweets(req, res) {
    const { username } = req.params;
    if (!username) {
        return res.status(400).json({ msg: "El nombre de usuario es requerido" });
    }

    try {
        const tweetSeguidos = await sequelize.query(
            `SELECT id_tweet, u.username, avatar, content, t.createdAt, c.nombre as categoria 
            FROM Seguimientos s 
            INNER JOIN Usuarios u ON u.id_user = s.id_seguido
            INNER JOIN Tweets t ON t.id_user = u.id_user
            INNER JOIN Categoria c ON c.id_categoria = t.categoria
            WHERE s.id_seguidor = (SELECT id_user FROM Usuarios WHERE username = :username)
            ORDER BY t.createdAt DESC;`,
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

async function crearSeguidor(req, res) {
    try {
        const id_seguidor = req.user.id;
        const id = parseInt(req.body.id);

        const usuarioSeguidor = await Usuario.findByPk(id);
        if (!usuarioSeguidor) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        // Verificar si ya existe el seguimiento
        const existeSeguidor = await sequelize.query(
            `SELECT id_seguidor FROM Seguimientos WHERE id_seguidor = :id_seguidor AND id_seguido = :id`,
            { replacements: { id_seguidor, id }, type: sequelize.QueryTypes.SELECT }
        );

        // Si el seguimiento existe, eliminarlo
        if (existeSeguidor.length > 0) {
            const query = await sequelize.query(
                `DELETE FROM Seguimientos WHERE id_seguidor = :id_seguidor AND id_seguido = :id`,
                { replacements: { id_seguidor, id }, type: sequelize.QueryTypes.DELETE }
            );
            return res.json({ msg: "Ya no sigues a esta persona" });
        }

        // Si no existe el seguimiento, crearlo
        const seguimiento = await sequelize.query(
            `INSERT INTO Seguimientos(id_seguidor, id_seguido) VALUES(:id_seguidor, :id)`,
            { replacements: { id_seguidor, id }, type: sequelize.QueryTypes.INSERT }
        );

        if (seguimiento) {
            return res.json({ msg: "Seguido exitosamente", id_seguido: id });
        }

        return res.status(500).json({ msg: "No se pudo crear el seguimiento" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: `Error interno al seguir: ${error.message}` });
    }
}

const seguimientosUsuariosCantidad = async (req, res) => {
    try {
        const userActive = req.user.id;
        const username = req.params.username;

        if (!username) return res.status(400).json({ msg: "El username es necesario para la operación" });

        const query = await sequelize.query(
            `SELECT 
            (SELECT COUNT(id_seguidor) 
            FROM Seguimientos 
            WHERE id_seguido = (SELECT id_user FROM Usuarios WHERE username = :username)) AS Seguidores,

            (SELECT COUNT(id_seguido) 
            FROM Seguimientos 
            WHERE id_seguidor = (SELECT id_user FROM Usuarios WHERE username = :username )) AS Seguidos,

            (SELECT CASE WHEN EXISTS (
                SELECT 1 
                FROM Seguimientos 
                WHERE id_seguidor = :userActive
                AND id_seguido = (SELECT id_user FROM Usuarios WHERE username = :username)
            ) THEN TRUE ELSE FALSE END) AS seSiguen;`,
            { 
                replacements: { username, userActive }, 
                type: sequelize.QueryTypes.SELECT 
            }
        );        

        if (query.length > 0) {
            return res.json(query[0]);
        }

        return res.status(404).json({ msg: "Aún no sigues a nadie, sé el primero" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error en el servidor al obtener el número de seguidos", error });
    }
}

module.exports = { followingTweets, crearSeguidor, seguimientosUsuariosCantidad };
