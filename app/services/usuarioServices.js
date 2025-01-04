import { UsuarioRepository } from "../repository/usuarioRepository.js";
import bcrypt from "bcrypt";

export class UsuarioServices {
    async createUser(userData, filePath) {
        try {
            const { password, ...restUserData } = userData;  // Desestructurar para obtener solo los datos del usuario

            // Verificar que todos los datos estén presentes
            if (!restUserData.username || !restUserData.name || !restUserData.lastname || !restUserData.email || !password) {
                throw new Error("Faltan campos obligatorios");
            }

            // Hash de la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Crear los datos del usuario con el avatar
            const usuarioData = {
                ...restUserData,
                password: hashedPassword,
                avatar: filePath 
            };

            const usuarioRepository = new UsuarioRepository();
            const nuevoUsuario = await usuarioRepository.crearUsuario(usuarioData); // Crear el usuario en la base de datos

            return nuevoUsuario;  // Devolver el usuario creado
        } catch (err) {
            console.log(err);
            return null;  // En caso de error, devolver null
        }
    }
}


export default UsuarioServices;
