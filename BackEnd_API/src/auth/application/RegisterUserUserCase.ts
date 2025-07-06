import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const saltRounds = parseInt(process.env.SALT_ROUNDS as string, 10);

export class RegisterUserUseCase {
    private userRepository: UserRepository;

    public constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async register(id: string, name: string, lastname: string, email: string, password: string): Promise<void> {
        const hashedPassword = await bcrypt.hash(password, saltRounds); 
        const user = new User(id, name, lastname, email, hashedPassword);
        await this.userRepository.register(user);
    }
}
