import { AnimalRepository } from "../domain/AnimalRepository";

export class GetAllAnimalUseCase {
    constructor(private animalRepository: AnimalRepository) {}

    async getAll() {
        return await this.animalRepository.getAll();
    }
}
