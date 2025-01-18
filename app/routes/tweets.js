const express = require("express");
const {verifyToken} = require("../middleware/auth.js");
const tweetController = require("../controllers/tweetController.js");

const route = express.Router();

route.post("/", verifyToken , tweetController.crearTweet);
route.get("/", verifyToken , tweetController.obtenerTweets);
route.get("/hashtags", tweetController.hashtagsTweets);
route.delete("/delete/:id", tweetController.eliminarTweet);

module.exports = route;