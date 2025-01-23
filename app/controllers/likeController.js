const { where } = require("sequelize");
const { sequelize } = require("../config/sequelize.js");
const { Likes } = require("../models/Likes.js");
const { Tweet } = require("../models/Tweet.js");
const { Usuario } = require("../models/Usuario.js")
const express = require("express");
const app = express();

const crearLike = async(req,res) =>{
    const idUser = req.user.id;
    const {id_tweet} = req.body;
    console.log({id_tweet,idUser});
    try{
        const isLike = await Likes.findOne({where:{id_user: idUser,id_tweet: id_tweet}});
        
        if(isLike){
            Likes.destroy({where:{id_user: idUser,id_tweet: id_tweet}});
            console.log("Eliminado");
            return res.json({msg:"Like eliminado con exito"})
        }
        Likes.create({ id_user: idUser, id_tweet: id_tweet});
        console.log();
        return res.json({msg:"Like creado exitosamente!"})

    }catch(err){
        res.status(500).json({msg:`Error interno al crear el like: ${err}`});
    }
}

const obtenerLikesInfoUser = async(req,res)=>{
    try{
        const user = req.user.id;
        const likesUser = await Likes.findAll({where:{id_user: user}});
        const tweetsConLikes = await Likes.findAll({
            attributes: [
              'id_tweet',                     
              [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('id_user'))), 'cantidad']  
            ],
            group: ['id_tweet'],
            raw: true,
          });
          
          if (tweetsConLikes.length === 0) {
            return res.json({ msg: "No hay tweets con likes" });
          }

        if(!likesUser) return res.json({msg:"El usuario no ha dado ningun Like"});
        
        const response = likesUser.flat();
        return res.json({likesUser, likesCount:tweetsConLikes, response});
    }catch(err){
        res.status(500).json({msg:`Error al obtener los likes: ${err}`});
    }
}

module.exports = {crearLike, obtenerLikesInfoUser}