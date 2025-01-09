import express from "express";
import {crearUsuario, loginUser} from "../controllers/usuarioController.js";

const route = express.Router();

route.post("/", crearUsuario);
route.post("/login", loginUser);

export default route;