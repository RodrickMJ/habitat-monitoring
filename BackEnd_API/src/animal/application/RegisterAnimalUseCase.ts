import { Animal } from "../domain/Animal";
import { AnimalRepository } from "../domain/AnimalRepository";

export class RegisterAnimalUseCase {
    constructor(private repository: AnimalRepository) { }

    // ✅ CAMBIO 1: Devolver Promise<Animal> en lugar de Promise<void>
    // ✅ CAMBIO 2: userId debe ser number, no string
    async registerAnimal(animal: Animal, userId: number): Promise<Animal> {
        animal.ownerId = userId.toString();
        
        // ✅ CAMBIO 3: Devolver el animal registrado desde el repositorio
        const registeredAnimal = await this.repository.registerAnimal(animal);
        
        return registeredAnimal;
    }
}