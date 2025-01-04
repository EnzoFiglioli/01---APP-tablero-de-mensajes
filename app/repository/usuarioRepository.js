import {Usuario} from "../models/Usuario.js";

export class UsuarioRepository{
    async crearUsuario(usuario){
        try {
            const usuarioModel = new Usuario(); 
            const nuevoUsuario = await usuarioModel.save(usuario);
            if(!nuevoUsuario) {
                console.log("Error al crear usuario");
                return null;
            }
            console.log("Usuario creado");
            return nuevoUsuario;
        } catch (error) {
            console.error("Error al crear usuario:", error);
            return null;
        }
    }
}