const express = require("express");
const {obtenerCategorias, funciona} = require("../controllers/categoriaController.js");

const route = express.Router();

route.get("/", obtenerCategorias);
route.get("/funciona", funciona);

module.exports = route;