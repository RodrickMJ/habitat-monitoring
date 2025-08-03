import { UserRepository } from "../domain/UserRepository";
import bcrypt from 'bcrypt';
import { generateToken } from "../../middlewares/Auth";

export class LoginUserUseCase {
    private userRepository: UserRepository;

    public constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async login(email: string, password: string): Promise<{ id: string, token: string }> {
        const user = await this.userRepository.login(email, password);

        if (!user) {
            throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        const token = generateToken({ id: user.id, email: user.email });

        if (!token) {
            throw new Error("Token generation failed");
        }

        user.token = token;
        await this.userRepository.updateToken(user.id, token);

        await this.postLoginFunction(user.id);

        return { id: user.id, token };
    }

    private async postLoginFunction(userId: string) {
        console.log(`Función ejecutada después del inicio de sesión para el usuario ${userId}`);
    }
}

