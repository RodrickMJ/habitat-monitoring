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
      res.status(400).json({
        message: errorMessage,
        success: false,
      });
    }
  }
}
