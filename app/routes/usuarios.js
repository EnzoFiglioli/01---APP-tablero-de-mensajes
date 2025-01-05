import express from "express";
import usuariosController from "../controllers/usuarioController.js";

const route = express.Router();
route.post("/", usuariosController.crearUsuario);
route.post("/login", usuariosController.loginUser);

export default route;