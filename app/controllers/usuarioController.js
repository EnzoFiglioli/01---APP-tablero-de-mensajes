const dotenv = require("dotenv");
const { Usuario } = require("../models/Usuario.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../config/sequelize.js");
const { Likes } = require("../models/Likes.js");
const { Tweet } = require("../models/Tweet.js");
const nodeMailer = require("nodemailer");
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const crearUsuario = async (req, res) => {
  try {
    const { password, email, avatar, ...newUser } = req.body;

    if (!password || !email) {
      return res.status(400).json({ msg: "Email y contraseña son obligatorios" });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Email no válido" });
    }

    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: "El correo ya está registrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const usuarioCreado = await Usuario.create({
      ...newUser,
      email,
      password: hashedPassword,
      avatar: avatar || "https://i.pinimg.com/736x/4f/27/ae/4f27aed5f2687e3da438b17001eb842e.jpg"
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

    const token = jwt.sign({ id: usuario.id_user }, process.env.SECRET_KEY, { expiresIn: "3d" });
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      maxAge: 259200000
    });

    return res.status(200).json({
      msg: "Usuario logeado",
      token,
      usuario: {
        id: usuario.id_user,
        email: usuario.email,
        avatar: usuario.avatar,
        name: usuario.name,
        lastname: usuario.lastname,
        username: usuario.username,
        verification: usuario.verification
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

    res.clearCookie("token");
    return res.status(200).json({ msg: "Sesión cerrada correctamente" });
  } catch (err) {
    console.error("Error al cerrar sesión:", err.message);
    res.status(500).json({ msg: "Error al cerrar sesión" });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const id = req.params.id;
    const query = await Usuario.findByPk(id);

    if (!query) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    if (query.id_user !== req.user.id) {
      return res.status(403).json({ msg: "No tienes permisos para eliminar este usuario" });
    }

    await Likes.destroy({ where: { id_user: id } });
    await Tweet.destroy({ where: { id_user: id } });
    await Usuario.destroy({ where: { id_user: id } });
    
    res.clearCookie("token");
    return res.json({ msg: "Usuario eliminado con éxito" });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ msg: `Error en el servidor al eliminar usuario: ${err}` });
  }
};

const usuarios = async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.json(usuarios);
};

const usuarioPorUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await Usuario.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    return res.json({
      id: user.id_user,
      username: user.username,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      avatar: user.avatar,
      verification: user.verification,
      bio: user.bio,
      link: user.link,
      ciudad: user.ciudad
    });
  } catch (err) {
    res.status(500).json({ msg: `Error interno al traer usuario por username: ${err}` });
  }
};


const editarUsuario = async (req, res) => {
  try {
    const { id, username, name, lastname, email, password, link, bio, ciudad } = req.body;
    const user = req.user.id;
    console.log(req.body.ciudad);
    if (!id || !lastname || !name || !email ) {
      return res.status(400).json({ msg: "Es requerido completar estos campos" });
    }

    const match = await Usuario.findByPk(id);
    if (!match) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    if (match.id_user !== user) {
      match.flat();
      console.log({match: match, user})
      return res.status(403).json({ msg: "No tienes permisos para editar este usuario" });
    }

    await match.update({
      username,
      email,
      name,
      lastname,
      link,
      bio,
      ciudad
    });

    return res.json({ msg: "Usuario actualizado correctamente", user: match });
    
  } catch (err) {
    console.error("Error en editarUsuario:", err);
    if (!res.headersSent) {
      return res.status(500).json({ msg: "Error al editar el usuario" });
    }
  }
};

const resetPassword = async (req, res) => {
  try {
    const baseDir = "http://localhost:5173" // || "https://tabl3ro.vercel.app"; 
    const { email } = req.body;
    const userExists = await Usuario.findOne({ where: { email: email } });
    const encriptado = jwt.sign({id: userExists.id_user}, process.env.SECRET_KEY, {expiresIn: "1h"});

    if (userExists) {
      const transporter = nodeMailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        secure: true,
        port: 465,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Cambio de contraseña",
        html: `
        <div style="font-family: Arial, sans-serif; padding: 40px; text-align: center; background-color: #f4f7fc; background-size: cover; background-position: center;">
  <div style="background-color: rgba(255, 255, 255, 0.8); border-radius: 15px; padding: 40px; max-width: 600px; margin: 0 auto;">
    <h1 style="font-size: 28px; color: #4A90E2; font-weight: bold;">¡Hola ${userExists.name} ${userExists.lastname}!</h1>
    <p style="font-size: 18px; color: #333333; line-height: 1.6; margin-top: 20px;">Soy <strong>Enzo Figlioli</strong>, creador de <strong>Tabl3ro</strong>.</p>
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">Recibimos una solicitud para cambiar la contraseña de tu cuenta.</p>
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">Si no fuiste tú, simplemente ignora este mensaje.</p>
    <p style="font-size: 16px; color: #333333; line-height: 1.6;">Si fuiste tú, haz clic en el siguiente enlace para cambiar tu contraseña:</p>
    <a href="${baseDir}/reset_password/${encriptado}" style="display: inline-block; padding: 12px 30px; background-color: #4A90E2; color: white; font-size: 18px; font-weight: bold; text-decoration: none; border-radius: 5px; margin-top: 20px;">Cambiar Contraseña</a>
    <p style="font-size: 16px; color: #333333; margin-top: 30px; line-height: 1.6;">¡Gracias por usar <strong>Tabl3ro</strong>! Estamos aquí para ayudarte en lo que necesites.</p>
  </div>
</div>

        `,
      }, (error, info) => {
        if (error) {
          console.log("Error al enviar el correo:", error);
          return res.status(500).json({ msg: "Error al enviar el correo" });
        } else {
          return res.status(200).json({ msg: "Correo enviado" });
        }
      });
    } else {
      res.status(404).json({ msg: "Usuario no encontrado" });
    }
  } catch (error) {
    console.log("Error en la solicitud:", error);
    res.status(500).json({ msg: "Error al enviar el correo" });
  }
};
const cambiarPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { auth } = req.params;

    // Step 1: Verify the JWT token
    let token;
    try {
      token = jwt.verify(auth, process.env.SECRET_KEY);
    } catch (error) {
      return res.status(400).json({ msg: "Token no válido o expirado" });
    }

    // Step 2: Find the user associated with the token
    const user = await Usuario.findByPk(token.id);

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Step 3: Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Step 4: Update the user's password
    await user.update({ password: hashedPassword });

    // Step 5: Return a success message
    return res.status(200).json({ msg: "Contraseña cambiada correctamente" });

  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    return res.status(500).json({ msg: "Error al cambiar la contraseña" });
  }
};


module.exports = {crearUsuario,loginUser,logout,eliminarUsuario, usuarioPorUsername,usuarios, editarUsuario, resetPassword, cambiarPassword}