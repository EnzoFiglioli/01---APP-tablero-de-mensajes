import { UsuarioServices } from "../services/usuarioServices.js"; 

const crearUsuario = async (req, res) => {
    try {
        const newUser = req.body;
        console.log('Datos recibidos:', newUser);

        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }
        const filePath = `/uploads/${req.file.filename}`;
        
        if (!newUser.username || !newUser.name || !newUser.lastname || !newUser.email || !newUser.password) {
            return res.status(400).json({ msg: "Faltan campos obligatorios." });
        }

        const usuarioServices = new UsuarioServices();
        const usuarioCreado = await usuarioServices.createUser(newUser, filePath);

        if (usuarioCreado) {
            res.json({ msg: "Usuario creado" });
        } else {
            res.status(400).json({ msg: "Usuario no creado" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error al crear usuario" });
    }
};

export default {
    crearUsuario,
};
