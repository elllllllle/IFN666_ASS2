const jwt = require("jsonwebtoken");
const TOKEN_SECRET = process.env.TOKEN_SECRET || "reading-tracker-secret-key";

const authenticateToken = (req, res, next) => {
    console.log("Auth header received:", req.headers["authorization"]);
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
        if (err) {
        return res.status(401).json({ error: "Invalid or expired token." });
        }
        req.user = decoded;
        next();
    });
};

module.exports = authenticateToken;