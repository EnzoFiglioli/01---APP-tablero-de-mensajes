const dotenv = require("dotenv");
const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const { connectDB } = require( "./app/config/sequelize.js");
const { upload } = require("./app/middleware/setterImages.js");

const userRoutes = require( "./app/routes/usuarios.js");
const tweetRoutes = require( "./app/routes/tweets.js");
const categoriasRoutes = require( "./app/routes/categorias.js");
const likeRoutes = require("./app/routes/likes.js");

const setModels = require( "./app/middleware/modelsSetters.js");
const { verifyToken } = require("./app/middleware/auth.js");
const { verify } = require("crypto");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://tabl3ro.vercel.app"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-csrf-token",
    ],
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
  })
);
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "app", "www", "uploads")));

app.use("/api/usuarios", upload.single("avatar"), userRoutes);
app.use("/api/tweets", tweetRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/like", likeRoutes);

app.get("/", (req, res) => {
  res.json({ api: "Server de tabl3ro"});
});

app.listen(port, async () => {
  await connectDB();
  setModels;
  console.log(`Server is running on port ${port}`);
});

module.exports = app;