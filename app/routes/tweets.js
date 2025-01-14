import express from "express";
import {verifyToken} from "../middleware/auth.js"
import tweetController from "../controllers/tweetController.js"

const route = express.Router();

route.post("/", verifyToken , tweetController.crearTweet);

export default route;