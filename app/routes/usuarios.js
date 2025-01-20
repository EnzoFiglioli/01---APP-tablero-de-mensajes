const express = require("express");
const {crearUsuario, loginUser, logout, usuarios, eliminarUsuario, usuarioPorUsername} = require("../controllers/usuarioController.js");
const {verifyToken} = require("../middleware/auth.js");
const { crearSeguidor, seguimientosUsuariosCantidad } = require("../controllers/seguimientosController.js");
const route = express.Router();

route.post("/", crearUsuario);
route.post("/login", loginUser);
route.get("/logout", verifyToken, logout);
route.get("/", verifyToken, usuarios);
route.delete("/:id", verifyToken, eliminarUsuario);
route.get("/:username", verifyToken, usuarioPorUsername);
route.get("/follow/:id", verifyToken, crearSeguidor);
route.get("/follow/info/:username", seguimientosUsuariosCantidad);

module.exports = route;