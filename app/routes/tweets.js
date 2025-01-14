import express from "express";
import Auth from "../middleware/auth"
import tweetController from "../controllers/tweetController"

const route = express.Router();

route.post("/", Auth.verifyToken ,tweetController.crearTweet);

export default route;