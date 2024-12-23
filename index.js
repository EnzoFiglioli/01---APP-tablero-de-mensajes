process.loadEnvFile();
import morgan from "morgan";
import express from "express";
import userRoutes from "./app/routes/usuarios.js";
import { connectDB } from "./app/config/sequelize.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.use("/api/usuarios", userRoutes);

app.listen(port, ()=> {
    connectDB();
    console.log(`Server is running on port ${port}`)
});