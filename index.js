process.loadEnvFile();

import morgan from "morgan";
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import {fileURLToPath} from "url";
import cookieParser from "cookie-parser";

import { connectDB } from "./app/config/sequelize.js";
import userRotes from "./app/routes/usuarios.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "app", "www", "uploads")));

app.use("/api/usuarios", upload.single("avatar") ,userRotes); 
app.get("/", (req,res)=>{res.json({api:"Server de tabl3ro"})})

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ msg: "Acceso denegado" });

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ msg: "Token inválido" });
    }
};

app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});

export default {upload, __dirname, verifyToken};