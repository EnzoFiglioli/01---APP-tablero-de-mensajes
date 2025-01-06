process.loadEnvFile();
import { Usuario } from "../models/Usuario.js";
import bcrypt from "bcrypt";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import jwt from "jsonwebtoken";

const uploadsPath = process.env.UPLOADS_PATH || path.join(process.cwd(), "app", "www", "uploads");

const crearUsuario = async (req, res) => {
    try {
        const { password, email, ...newUser } = req.body;

        if (!password || !email) {
            return res.status(400).json({ msg: "Email y contraseña son obligatorios" });
        }

        if (!req.file) {
            return res.status(400).json({ msg: "No file uploaded." });
        }

        if (!req.file.mimetype.startsWith("image/")) {
            return res.status(400).json({ msg: "El archivo debe ser una imagen." });
        }

        const existingUser = await Usuario.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ msg: "El correo ya está registrado" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const processedBuffer = await sharp(req.file.buffer)
            .resize(250, 250)
            .jpeg({ quality: 80 })
            .toBuffer();

        const avatarFilename = `${req.file.fieldname}-${Date.now()}.jpeg`;
        const avatarRelativePath = `/uploads/${avatarFilename}`;
        const avatarAbsolutePath = path.join(uploadsPath, avatarFilename);

        await fs.writeFile(avatarAbsolutePath, processedBuffer);

        const usuarioCreado = await Usuario.create({
            ...newUser,
            email,
            password: hashedPassword,
            avatar: avatarRelativePath,
        });

        res.status(201).json({ msg: "Usuario creado", usuario: usuarioCreado });
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

        if (!usuario) {
            return res.status(400).json({ msg: "Usuario no encontrado" });
        }

        const match = await bcrypt.compare(password, usuario.password);
        if (!match) {
            return res.status(401).json({ msg: "Contraseña incorrecta" });
        }

        const token = jwt.sign({ id: usuario.id_user }, process.env.SECRET_KEY, { expiresIn: "1h" });
        console.log(token);
        
        res.cookie("token", token, {
            httpOnly: false,
            secure: false,
            sameSite: "lax",
        });
        

        res.status(200).json({ msg: "Usuario logeado", usuario });
    } catch (err) {
        console.error("Error al iniciar sesión:", err.message);
        res.status(500).json({ msg: "Error al iniciar sesión" });
    }
};

export default {
    crearUsuario,
    loginUser,
};
