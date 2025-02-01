const { sequelize } = require("../config/sequelize.js");

async function crearTweet(req, res) {
    try {
        const userActive = req.user.id;
        if (!userActive) {
            return res.status(401).json({ message: "Usuario no autenticado." });
        }

        const { content, categoria, image} = req.body;

        if (!content || typeof content !== "string" || content.trim() === "") {
            return res.status(400).json({ message: "Faltan datos necesarios o contenido inválido." });
        }

        const tweet = await sequelize.query(
            "INSERT INTO Tweets (id_user, content, categoria, image) VALUES (?, ?, ?, ?);",
            {
                replacements: [userActive, content.trim(), categoria, image],
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
    const user = req.user.id
    try {
        const tweets = await sequelize.query(
           `SELECT t.id_tweet, c.nombre AS categoria,u.username,u.name,u.lastname,t.content,t.createdAt, u.avatar,COUNT(DISTINCT l.id_user) AS likes, CASE WHEN EXISTS (SELECT 1 FROM Likes l2 WHERE l2.id_tweet = t.id_tweet AND l2.id_user = :user) THEN 1 ELSE 0 END AS le_dio_like
           FROM Tweets t
           INNER JOIN Categoria c ON t.categoria = c.id_categoria
           INNER JOIN Usuarios u ON u.id_user = t.id_user
           LEFT JOIN Likes l ON l.id_tweet = t.id_tweet
           GROUP BY t.id_tweet, c.nombre, u.username, u.name, u.lastname, t.content, t.createdAt, u.avatar
           ORDER BY t.createdAt DESC;`
        ,{replacements:{user},type: sequelize.QueryTypes.SELECT})

        if (tweets.length > 0) {
            const tweetsList = tweets.map((i)=>(
                {
                    createdAt : i.createdAt,
                    id_tweet: i.id_tweet,
                    name: i.name,
                    lastname: i.lastname,
                    categoria: i.categoria,
                    username: i.username,
                    content: i.content,
                    avatar: i.avatar,
                    likes: i.likes,
                    likeActive: i.le_dio_like
                }));
            return res.json(tweetsList);
        } else {
            return res.status(200).json({ msg: "No se encontraron tweets, sé el primero." });
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

const obtenerTweetsID = async (req, res) => {
    try {
        const username = req.params.username;
        const query = await sequelize.query(
            `SELECT 
                t.id_tweet, 
                c.nombre AS categoria,
                u.username,
                u.name,
                u.lastname,
                t.content,
                t.createdAt, 
                u.avatar,
                COUNT(DISTINCT l.id_user) AS likes, CASE WHEN EXISTS (
                    SELECT 1 
                    FROM Likes l2 
                    WHERE l2.id_tweet = t.id_tweet AND l2.id_user = (
                        SELECT id_user 
                        FROM Usuarios 
                        WHERE username = :username
                        )
                    ) THEN 1 ELSE 0 END AS le_dio_like
            FROM Tweets t
            INNER JOIN Categoria c ON t.categoria = c.id_categoria
            INNER JOIN Usuarios u ON u.id_user = t.id_user
            LEFT JOIN Likes l ON l.id_tweet = t.id_tweet
            GROUP BY t.id_tweet, c.nombre, u.username, u.name, u.lastname, t.content, t.createdAt, u.avatar
            HAVING u.username = :username
            ORDER BY t.createdAt DESC;`, { replacements:{username}, type: sequelize.QueryTypes.SELECT });

        if (query.length > 0) {
            const tweetsList = query.map(i => ({
                createdAt : i.createdAt,
                id_tweet: i.id_tweet,
                name: i.name,
                lastname: i.lastname,
                categoria: i.categoria,
                username: i.username,
                content: i.content,
                avatar: i.avatar,
                likes: i.likes,
                likeActive: i.le_dio_like
            }));
            return res.json(tweetsList);
        } else {
            return res.json([]);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: `Error interno al obtener tweets para el usuario: ${err}` });
    }
};

module.exports = { crearTweet, obtenerTweets, hashtagsTweets, eliminarTweet, obtenerTweetsID };
