import { Request, Response } from "express";
import { LogOutUseCase } from "../../application/LogOutUseCase";

export class LogOutController {
    constructor(private logOutUseCase: LogOutUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            res.status(401).json({ 
                message: 'Token de autorización requerido',
                success: false 
            });
            return;
        }

        if (!authHeader.startsWith('Bearer ')) {
            res.status(401).json({ 
                message: 'Formato de autorización inválido. Use: Bearer <token>',
                success: false 
            });
            return;
        }

        const token = authHeader.split(' ')[1];

        if (!token || token.trim() === '') {
            res.status(401).json({ 
                message: 'Token no válido',
                success: false 
            });
            return;
        }

        try {
            await this.logOutUseCase.execute(token);
            res.status(200).json({ 
                message: 'Usuario ha hecho logout exitosamente',
                success: true 
            });
        } catch (error) {
            console.error('Error en logout:', error);
            
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            
            if (errorMessage.includes('token') || 
                errorMessage.includes('invalid') || 
                errorMessage.includes('expired') ||
                errorMessage.includes('unauthorized') ||
                errorMessage.includes('jwt')) {
                res.status(401).json({ 
                    message: 'Token inválido o expirado',
                    success: false 
                });
                return;
            }
            
            res.status(500).json({ 
                message: 'Error interno del servidor',
                success: false 
            });
        }
    }
}