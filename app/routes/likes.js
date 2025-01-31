const express = require("express");
const route = express.Router();

const {verifyToken} = require("../middleware/auth.js");
const { crearLike } = require("../controllers/likeController.js");

route.post("/create", verifyToken, crearLike);

module.exports = route;