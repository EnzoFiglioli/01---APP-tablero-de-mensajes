const express = require("express");
const {crearUsuario, loginUser, logout, usuarios} = require("../controllers/usuarioController.js");
const {verifyToken} = require("../middleware/auth.js")
const route = express.Router();

route.post("/", crearUsuario);
route.post("/login", loginUser);
route.get("/logout", verifyToken, logout);
route.get("/", usuarios);

module.exports = route;