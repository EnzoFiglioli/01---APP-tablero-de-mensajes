import express from "express";
import {crearUsuario, loginUser, logout, usuarios} from "../controllers/usuarioController.js";
import {verifyToken} from "../middleware/auth.js"
const route = express.Router();

route.post("/", crearUsuario);
route.post("/login", loginUser);
route.get("/logout", verifyToken, logout);
route.get("/", usuarios);

export default route;