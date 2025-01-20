const express = require("express");
const {crearUsuario, loginUser, logout, usuarios, eliminarUsuario, usuarioPorUsername} = require("../controllers/usuarioController.js");
const {verifyToken} = require("../middleware/auth.js")
const route = express.Router();

route.post("/", crearUsuario);
route.post("/login", loginUser);
route.get("/logout", verifyToken, logout);
route.get("/", usuarios);
route.delete("/:id", eliminarUsuario);
route.get("/:username",usuarioPorUsername);

module.exports = route;