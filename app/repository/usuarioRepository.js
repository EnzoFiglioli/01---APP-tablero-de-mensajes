import Usuario from "../models/Usuario.js";

export class UsuarioRepository{
    usuarioModel = new Usuario(); 

    async crearUsuario(usuario){
        const nuevoUsuario = await this.usuarioModel.save(usuario);
        return nuevoUsuario;
    }
}