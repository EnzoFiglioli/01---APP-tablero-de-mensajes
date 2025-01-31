const { Likes } = require("../models/Likes.js");
const express = require("express");

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

module.exports = {crearLike}