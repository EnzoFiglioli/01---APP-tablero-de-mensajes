import express from "express";
import usuariosController from "../controllers/usuarioController.js";

const route = express.Router();

route.post("/", usuariosController.crearUsuario);

export default route;