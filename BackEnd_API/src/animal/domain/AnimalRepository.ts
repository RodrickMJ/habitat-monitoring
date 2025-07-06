import { Animal } from './Animal';

export interface AnimalRepository {
    getAll(): Promise<Animal[]>;
    registerAnimal(animal: Animal): Promise<void>;
    getById(id: string): Promise<Animal | null>;
    getAnimalsByOwnerId(ownerId: string): Promise<Animal[]>; 
}
