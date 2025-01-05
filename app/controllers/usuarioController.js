process.loadEnvFile();
import { Usuario } from "../models/Usuario.js";
import bcrypt from "bcrypt";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const uploadsPath = process.env.UPLOADS_PATH || path.join(__dirname, "app", "www", "uploads");

const crearUsuario = async (req, res) => {
    try {
        const { password, ...newUser } = req.body;

        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        if (!req.file.mimetype.startsWith("image/")) {
            return res.status(400).send("El archivo debe ser una imagen.");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Procesar la imagen
        const processedBuffer = await sharp(req.file.buffer)
            .resize(250, 250)
            .jpeg({ quality: 80 })
            .toBuffer();

        // Define el nombre y la ruta relativa del archivo
        const avatarFilename = `${req.file.fieldname}-${Date.now()}.jpeg`;
        const avatarRelativePath = `/uploads/${avatarFilename}`; 
        const avatarAbsolutePath = path.join(uploadsPath, avatarFilename); // Ruta absoluta para guardar

        // Guardar la imagen comprimida
        fs.writeFileSync(avatarAbsolutePath, processedBuffer);

        // Guardar el usuario en la base de datos
        const usuarioCreado = await Usuario.create({
            password: hashedPassword,
            ...newUser,
            avatar: avatarRelativePath, // Solo guarda la ruta relativa en la BD
        });

        if (usuarioCreado) {
            res.status(201).json({ msg: "Usuario creado", usuario: usuarioCreado });
        } else {
            res.status(400).json({ msg: "No se pudo crear el usuario" });
        }
    } catch (err) {
        console.error("Error al crear el usuario:", err.message);
        res.status(500).json({ msg: "Error al crear usuario" });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Faltan email o contraseña" });
        }

        const usuario = await Usuario.findOne({ where: { email } });

        if (usuario) {
            const match = await bcrypt.compare(password, usuario.password);
            if (match) {
                res.status(200).json({ msg: "Usuario logeado", usuario });
            } else {
                res.status(400).json({ msg: "Usuario y/o contraseña incorrectos" });
            }
        } else {
            res.status(400).json({ msg: "Usuario no encontrado" });
        }
    } catch (err) {
        console.error('Error al iniciar sesión:', err.message);  // Mensaje de error detallado
        res.status(500).json({ msg: "Error al iniciar sesión" });
    }
};

export default {
    crearUsuario,
    loginUser,
};
