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

async function crearSeguidor(req,res){
    try{
        const id_seguidor = req.user.id;
        const id = parseInt(req.params.id);

        const usuarioSeguidor = await Usuario.findByPk(id);
        
        if(!usuarioSeguidor) return res.status(404).json({msg:"Usuario no encontrado"});
        
        const seguimiento = await sequelize.query(
            `INSERT INTO Seguimientos(id_seguido, id_seguidor) VALUES(:id, :id_seguidor);`,
            {
                replacements: { id, id_seguidor },
                type: sequelize.QueryTypes.INSERT
            }
        );
        console.log(seguimiento);

        if (seguimiento) {
            return res.json({ msg: "Seguido exitosamente", id_seguido: id });
        }
        
        return res.status(404).json({msg:"No se pudo crear el seguimiento"});
    }catch(error){
        console.log(error);
        res.status(500).json({msg:`Error interno al seguir: ${error}`});
    }
}

const seguimientosUsuariosCantidad = async(req,res)=>{
    try{
        const username = req.params.username;

        if(!username) return res.status(400).json({msg:"El username es necesario para la operacion"});
        
        const query = await sequelize.query(
            `SELECT
            (SELECT COUNT(id_seguidor) FROM Seguimientos WHERE id_seguido = (SELECT id_user FROM Usuarios WHERE username = :username )) AS Seguidores,
            (SELECT COUNT(id_seguido) FROM Seguimientos WHERE id_seguidor = (SELECT id_user FROM Usuarios WHERE username = :username )) AS Seguidos;` ,{replacements:{ username }, type: sequelize.QueryTypes.SELECT});
        
        if(query.length > 0){
            return res.json(query[0]);
        }
        return res.status(404).json({msg:"Aún no sigues a nadie, se el primero"});
        
    }catch(error){
        console.log(error);
        res.status(500).json({msg:"Error en el servidor al obtener el numero de seguidos", error});
    }
} 

module.exports = { followingTweets, crearSeguidor, seguimientosUsuariosCantidad };
