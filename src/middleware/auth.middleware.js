const jwt = require("jsonwebtoken");
const AppError = require("../utils/utilsAppError");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("To'ken noto'g'ri.",401)
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "secret"
        );

        req.user = decoded;

        next();
    } catch (error) {
        next(error)
    }
};

module.exports = authMiddleware;