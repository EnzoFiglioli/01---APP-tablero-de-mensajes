import express from "express";
import {crearUsuario, loginUser, logout} from "../controllers/usuarioController.js";
import {verifyToken} from "../middleware/auth.js"
const route = express.Router();

route.post("/", crearUsuario);
route.post("/login", loginUser);
route.get("/logout", verifyToken, logout);

export default route;