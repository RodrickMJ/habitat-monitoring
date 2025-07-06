import { Request, Response } from "express";
import { RegisterUserUseCase } from "../../application/RegisterUserUserCase";

export class RegisterController {
    constructor(private registerUserUseCase: RegisterUserUseCase) { }

    async run(req: Request, res: Response) {
        try {
            const { id, name, lastname, email, password } = req.body;
            await this.registerUserUseCase.register(id, name, lastname, email, password);
            res.status(201).json({
                message: 'User registered successfully',
                success: true,
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
