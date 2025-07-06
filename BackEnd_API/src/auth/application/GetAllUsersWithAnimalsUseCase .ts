import { UserRepository } from "../domain/UserRepository";
import { User } from "../domain/User";
import { AnimalRepository } from "../../animal/domain/AnimalRepository";

export class GetAllUsersWithAnimalsUseCase {
    constructor(private userRepository: UserRepository, private animalRepository: AnimalRepository) {}

    async execute(): Promise<User[]> {
        const users = await this.userRepository.getAllUsers();
        for (const user of users) {
            const animals = await this.animalRepository.getAnimalsByOwnerId(user.id);
            user.animals = animals;
        }
        return users;
    }
}
