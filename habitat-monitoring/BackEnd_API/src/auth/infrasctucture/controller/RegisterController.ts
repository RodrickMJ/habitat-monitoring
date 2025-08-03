import { Request, Response } from "express";
import { RegisterUserUseCase } from "../../application/RegisterUserUserCase";

export class RegisterController {
    constructor(private registerUserUseCase: RegisterUserUseCase) { }

    async run(req: Request, res: Response) {
        try {
            const { id, name, lastname, email, password } = req.body;

            // ✅ VALIDACIÓN 1: Campos requeridos
            if (!name || name.trim() === '') {
                return res.status(400).json({
                    message: 'Faltan campos obligatorios en la solicitud.',
                    success: false,
                    code: 400
                });
            }

            if (!lastname || lastname.trim() === '') {
                return res.status(400).json({
                    message: 'Faltan campos obligatorios en la solicitud.',
                    success: false,
                    code: 400
                });
            }

            if (!email || email.trim() === '') {
                return res.status(400).json({
                    message: 'Faltan campos obligatorios en la solicitud.',
                    success: false,
                    code: 400
                });
            }

            if (!password || password.trim() === '') {
                return res.status(400).json({
                    message: 'Faltan campos obligatorios en la solicitud.',
                    success: false,
                    code: 400
                });
            }

            // ✅ VALIDACIÓN 2: Formato de email (REGEX MEJORADO)
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            
            // Validaciones adicionales para casos específicos
            const trimmedEmail = email.trim();
            
            // No permitir puntos consecutivos
            if (trimmedEmail.includes('..')) {
                return res.status(400).json({
                    error: "Formato de email inválido",
                    message: "El correo electrónico proporcionado no tiene un formato válido.",
                    code: 400,
                    success: false
                });
            }
            
            // No permitir @ al inicio o final
            if (trimmedEmail.startsWith('@') || trimmedEmail.endsWith('@')) {
                return res.status(400).json({
                    error: "Formato de email inválido",
                    message: "El correo electrónico proporcionado no tiene un formato válido.",
                    code: 400,
                    success: false
                });
            }
            
            // No permitir punto al inicio del dominio
            if (trimmedEmail.includes('@.')) {
                return res.status(400).json({
                    error: "Formato de email inválido",
                    message: "El correo electrónico proporcionado no tiene un formato válido.",
                    code: 400,
                    success: false
                });
            }
            
            // Validación principal con regex
            if (!emailRegex.test(trimmedEmail)) {
                return res.status(400).json({
                    error: "Formato de email inválido",
                    message: "El correo electrónico proporcionado no tiene un formato válido.",
                    code: 400,
                    success: false
                });
            }

            // ✅ VALIDACIÓN 3: Longitud mínima de contraseña
            if (password.length < 6) {
                return res.status(400).json({
                    error: "Contraseña muy corta",
                    message: "La contraseña debe tener al menos 6 caracteres.",
                    code: 400,
                    success: false
                });
            }

            // Ejecutar el caso de uso
            await this.registerUserUseCase.register(id, name.trim(), lastname.trim(), trimmedEmail.toLowerCase(), password);
            
            res.status(201).json({
                message: 'User registered successfully',
                success: true,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            
            // ✅ MANEJO ESPECÍFICO: Email duplicado
            if (errorMessage.includes('Duplicate entry') && errorMessage.includes('email')) {
                return res.status(409).json({
                    error: "Email duplicado",
                    message: "El correo electrónico ya está en uso por otro usuario.",
                    code: 409,
                    success: false
                });
            }

            // ✅ MANEJO GENÉRICO: Otros errores
            res.status(400).json({
                message: errorMessage,
                success: false,
            });
        }
    }
}