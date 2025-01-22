const express = require("express");
const route = express.Router();

const {verifyToken} = require("../middleware/auth.js");
const {crearLike, obtenerLikesInfoUser} = require("../controllers/likeController.js");

route.post("/create", verifyToken, crearLike);
route.get("/info", verifyToken, obtenerLikesInfoUser);

module.exports = route;