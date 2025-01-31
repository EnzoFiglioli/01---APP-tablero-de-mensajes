const express = require("express");
const {obtenerCategorias} = require("../controllers/categoriaController.js");

const route = express.Router();

route.get("/", obtenerCategorias);

module.exports = route;