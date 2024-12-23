import {UsuarioServices} from "../services/usuarioServices.js"

const crearUsuario = (req, res) => {
    try{
        const newUser = req.body;
        UsuarioServices.crearUsuario(newUser) ? 
        res.json({msg: "Usuario creado"}) :
        res.status(400).json({msg: "Usuario no creado"});
    }catch(err){
        res.status(500).json({msg: "Error al crear usuario"});
    }
};

export default {
    crearUsuario,
};  