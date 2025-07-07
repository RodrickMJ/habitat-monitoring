import { Request, Response } from "express";
import { LoginUserUseCase } from "../../application/LoginUserUseCase";

export class LoginController {
  constructor(private loginUserUseCase: LoginUserUseCase) { }

  async run(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { id, token } = await this.loginUserUseCase.login(email, password);

      res.status(200).json({
        message: 'User logged in successfully',
        success: true,
        id,  
        token,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Lista de mensajes que indican errores de autenticación (401)
      const authErrorMessages = [
        'Credenciales inválidas',
        'Invalid credentials', 
        'Invalid email or password',
        'User not found',
        'Usuario no encontrado',
        'Incorrect password',
        'Contraseña incorrecta'
      ];

      // Verificar si es un error de autenticación
      const isAuthError = authErrorMessages.some(msg => 
        errorMessage.includes(msg)
      );

      if (isAuthError) {
        return res.status(401).json({
          message: 'Credenciales inválidas',
          success: false,
          code: 401,
        });
      }

      // Error de validación o formato (400)
      res.status(400).json({
        message: errorMessage,
        success: false,
        code: 400,
      });
    }
  }
}