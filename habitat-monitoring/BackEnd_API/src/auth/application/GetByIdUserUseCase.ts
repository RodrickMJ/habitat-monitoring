import { UserRepository } from "../domain/UserRepository";
import { User } from "../domain/User";

export class GetUserByIdUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(id: string): Promise<User | null> {
        return await this.userRepository.getById(id);
    }
}
