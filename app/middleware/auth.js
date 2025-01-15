const  jwt = require("jsonwebtoken");
const  dotenv = require("dotenv");
dotenv.config();

function verifyToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "No estás autenticado." });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido o expirado." });
    }
}

module.exports = {verifyToken}
