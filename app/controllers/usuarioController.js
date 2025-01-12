import dotenv from "dotenv";
import { Usuario } from "../models/Usuario.js";
import bcrypt from "bcrypt";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import jwt from "jsonwebtoken";
import { mkdir, existsSync } from "fs";

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const uploadsPath = process.env.UPLOADS_PATH || path.join(process.cwd(), "app", "www", "uploads");

if (!existsSync(uploadsPath)) {
  mkdir(uploadsPath, { recursive: true }); 
}

const crearAvatar = async (buffer) => {
  const processedBuffer = await sharp(buffer)
    .resize(250, 250)
    .jpeg({ quality: 80 })
    .toBuffer();

  const avatarFilename = `${Date.now()}.jpeg`;
  const avatarAbsolutePath = path.join(uploadsPath, avatarFilename);

  await fs.writeFile(avatarAbsolutePath, processedBuffer);
  return `/uploads/${avatarFilename}`;
};

const crearUsuario = async (req, res) => {
  try {
    const { password, email, ...newUser } = req.body;

    // Validación de parámetros requeridos
    if (!password || !email) {
      return res.status(400).json({ msg: "Email y contraseña son obligatorios" });
    }

    // Validación de existencia de archivo de imagen
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded." });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ msg: "El archivo debe ser una imagen." });
    }

    // Validación de formato de email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Email no válido" });
    }

    // Verificar si el usuario ya existe
    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: "El correo ya está registrado" });
    }

    // Encriptación de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Procesar la imagen de avatar
    const avatarRelativePath = await crearAvatar(req.file.buffer);

    // Crear el usuario en la base de datos
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

    // Validación de parámetros
    if (!email || !password) {
      return res.status(400).json({ msg: "Faltan email o contraseña" });
    }

    // Buscar usuario en la base de datos
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ msg: "Usuario no encontrado" });
    }

    // Comparar la contraseña
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      return res.status(401).json({ msg: "Contraseña incorrecta" });
    }

    // Crear el token JWT
    const token = jwt.sign({ id: usuario.id_user }, process.env.SECRET_KEY, { expiresIn: "1h" });

    // Establecer la cookie con el token
    res.cookie('token', token, {
      httpOnly: true,  // Evita el acceso desde JavaScript
      secure: isProduction,  // Solo envía cookies a través de HTTPS en producción
      sameSite: isProduction ? 'None' : 'Lax', // 'None' si estás trabajando con CORS (dominios diferentes)
      maxAge: 3600000,  // Cookie válida por 1 hora
    });

    res.status(200).json({ msg: "Usuario logeado", usuario });
  } catch (err) {
    console.error("Error al iniciar sesión:", err.message);
    res.status(500).json({ msg: "Error al iniciar sesión" });
  }
};

export { crearUsuario, loginUser };
