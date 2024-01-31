"use strict";
// authMiddleware.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requireAuth = (req, res, next) => {
    const token = req.headers.authorization?.split("Bearer ")[1] || req.cookies.jwt;
    if (token) {
        try {
            // verify
            const decodedToken = jsonwebtoken_1.default.verify(token, `${process.env.SECRET}`);
            // Attach the decoded token to the request for further use
            req.user = decodedToken;
            return next();
        }
        catch (error) {
            // verification failed
            return res.status(401).send("Unauthorized");
        }
    }
    // no token
    return res.status(401).send("Unauthorized");
};
exports.default = requireAuth;
//# sourceMappingURL=requireAuth.js.map