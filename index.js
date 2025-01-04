process.loadEnvFile();
import morgan from "morgan";
import express from "express";
import { connectDB } from "./app/config/sequelize.js";
import user from "./app/controllers/usuarioController.js";
import cors from "cors";
import multer from "multer";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./app/www/uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "app", "www", "uploads")));



app.post("/api/usuarios", upload.single('file'), user.crearUsuario); 

app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});
