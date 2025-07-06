import { Request, Response } from "express";
import { LogOutUseCase } from "../../application/LogOutUseCase";

export class LogOutController {
    constructor(private logOutUseCase: LogOutUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(400).json({ message: 'Token no proporcionado' });
            return;
        }

        try {
            await this.logOutUseCase.execute(token);
            res.status(200).json({ message: 'Usuario ha hecho logout exitosamente' });
        } catch (error) {
            console.error('Error en logout:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
}
