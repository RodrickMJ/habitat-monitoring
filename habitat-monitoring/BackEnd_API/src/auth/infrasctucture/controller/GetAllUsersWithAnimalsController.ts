import { Request, Response } from "express";
import { GetAllUsersWithAnimalsUseCase } from "../../application/GetAllUsersWithAnimalsUseCase ";

export class GetAllUsersWithAnimalsController {
    constructor(private getAllUsersWithAnimalsUseCase: GetAllUsersWithAnimalsUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.getAllUsersWithAnimalsUseCase.execute();
            
            const response = users.map(user => ({
                id: user.id,
                name: user.name,
                lastname: user.lastname,
                animals: user.animals
            }));

            res.status(200).json({
                message: "Users retrieved successfully",
                success: true,
                data: response
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
