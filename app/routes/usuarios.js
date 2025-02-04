const express = require("express");
const {crearUsuario, loginUser, logout, usuarios, eliminarUsuario, usuarioPorUsername, editarUsuario, resetPassword, cambiarPassword} = require("../controllers/usuarioController.js");
const {verifyToken} = require("../middleware/auth.js");
const { crearSeguidor, seguimientosUsuariosCantidad } = require("../controllers/seguimientosController.js");
const route = express.Router();

route.post("/", crearUsuario);
route.post("/login", loginUser);
route.get("/logout", verifyToken, logout);
route.get("/", verifyToken, usuarios);
route.delete("/:id", verifyToken, eliminarUsuario);
route.patch("/editar", verifyToken, editarUsuario);
route.get("/:username", verifyToken, usuarioPorUsername);
route.post("/follow", verifyToken, crearSeguidor);
route.get("/follow/info/:username", verifyToken, seguimientosUsuariosCantidad);
route.post("/reset-password", resetPassword);
route.patch("/reset_password/:auth", cambiarPassword);

module.exports = route;