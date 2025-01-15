const dotenv = require("dotenv");
const {Usuario} = require("../models/Usuario.js");
const bcrypt = require("bcrypt");
const sharp = require("sharp");
const fs = require("fs/promises");
const path = require("path");
const jwt = require("jsonwebtoken");
const { mkdir, existsSync } = require("fs");

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

  if(!isProduction){
    await fs.writeFile(avatarAbsolutePath, processedBuffer)
    return `/uploads/${avatarFilename}`;
  }else{
    return;
  }
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
      avatar: isProduction ? "https://i.pinimg.com/736x/4f/27/ae/4f27aed5f2687e3da438b17001eb842e.jpg" : avatarRelativePath,
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

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      maxAge: 3600000,
    });

    const path = req.get("host").startsWith("pinimg") ? usuario.avatar :`${req.protocol}://${req.get("host")}${usuario.avatar}`;

    return res.status(200).json({
      msg: "Usuario logeado",
      token,
      usuario: {
        id: usuario.id_user,
        email: usuario.email,
        avatar: path
      },
    });
  } catch (err) {
    console.error("Error al iniciar sesión:", err.message);
    res.status(500).json({ msg: "Error al iniciar sesión" });
  }
};


const logout = (req, res) => {
  try {
    const session = req.cookies.token;
    if (!session) {
      return res.status(404).json({ msg: "No existe una sesión activa" });
    }

    // Si existe la sesión, borrar la cookie
    res.clearCookie("token");

    return res.status(200).json({ msg: "Sesión cerrada correctamente" });
  } catch (err) {
    console.error("Error al cerrar sesión:", err.message);
    res.status(500).json({ msg: "Error al cerrar sesión" });
  }
};

const usuarios = async (req,res) => {
  const usuarios = await Usuario.findAll()
  res.json(usuarios)
}

module.exports = {crearUsuario,loginUser,logout,usuarios}