import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.SECRET_KEY as string;

export const generateToken = (data: any) => {
    try {
        const token = jwt.sign(data, secretKey, { expiresIn: '1h' });
        return token;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).send('Access denied.');
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid token.');
        }

        (req as any).user = decoded;
        next();
    });
};
