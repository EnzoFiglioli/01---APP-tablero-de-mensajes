import dotenv from "dotenv";
import morgan from "morgan";
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

import { connectDB } from "./app/config/sequelize.js";
import userRoutes from "./app/routes/usuarios.js";
import tweetRoutes from "./app/routes/tweets.js";

dotenv.config();

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
app.use(
  cors({
    origin: ["http://localhost:5173", "https://tabl3ro.vercel.app"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "app", "www", "uploads")));

app.use("/api/usuarios", upload.single("avatar"), userRoutes);
app.use("/api/tweets", tweetRoutes);

app.get("/", (req, res) => {
  res.json({ api: "Server de tabl3ro" });
});

app.listen(port, async () => {
  await connectDB();
  console.log(`Server is running on port ${port}`);
});

export default app;