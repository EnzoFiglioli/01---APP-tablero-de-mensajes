process.loadEnvFile();
import morgan from "morgan";
import express from "express";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/usuarios", require("./app/routes/usuarios.js"));

app.listen(port, ()=> console.log(`Server is running on port ${port}`));