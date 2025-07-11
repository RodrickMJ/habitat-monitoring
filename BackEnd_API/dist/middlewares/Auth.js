"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretKey = process.env.SECRET_KEY;
const generateToken = (data) => {
    try {
        const token = jsonwebtoken_1.default.sign(data, secretKey, { expiresIn: '1h' });
        return token;
    }
    catch (error) {
        console.error(error);
        return null;
    }
};
exports.generateToken = generateToken;
const authenticateJWT = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(403).send('Access denied.');
    }
    jsonwebtoken_1.default.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid token.');
        }
        req.user = decoded;
        next();
    });
};
exports.authenticateJWT = authenticateJWT;
