const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: Token is required" });
    }

    try {
        const actualToken = token.split(" ")[1];
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
        req.user = decoded; // ✅ This must exist!
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token", error });
    }
};

module.exports = { verifyToken };
