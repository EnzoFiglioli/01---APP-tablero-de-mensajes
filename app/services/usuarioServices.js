import {UsuarioRepository} from "../repository/usuarioRepository.js";

export class UsuarioServices{
    async createUser(){
        try{
            const usuario = await UsuarioRepository.prototype.crearUsuario();
            return usuario;
        }catch(err){
            console.log(err);
        }
    }
}
