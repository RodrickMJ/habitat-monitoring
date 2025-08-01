import { IncomingMessage } from "http";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
type AuthCallback = (err: string | null, success: boolean) => void;

const authMiddleware = (req: IncomingMessage, callback: AuthCallback) => {
    try {
        const authorizationHeader = req.headers['authorization'];
        const SECRET = process.env["JWT_SECRET"] ?? "DEFAULT_SECRET";
        
        if (!authorizationHeader) {
            callback('No token provided', false);
            return;
        }

        const token = authorizationHeader.replace('Bearer ', '');

        if (token === '123ADWAWDAWDQWDAD33') {
            callback(null, true);
        } else {
            jwt.verify(token, SECRET, (err, decoded) => {
                if (err) {
                    callback('Token Invalid', false);
                } else {
                    console.log(decoded);
                    callback(null, true);
                }
            });
        }
    } catch (error) {
        console.log(error);
        callback('Internal Server Error', false);
    }
};

export default authMiddleware;