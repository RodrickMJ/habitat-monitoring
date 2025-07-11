import { Animal } from "../domain/Animal";
import { AnimalRepository } from "../domain/AnimalRepository";

export class GetByIdAnimalUseCase {
    constructor(private repository: AnimalRepository) { }

    async getById(id: string, userId: string): Promise<Animal | null> {
        console.log('🔍 Use case DEBUG - Input:', {
            animalId: id,
            userId: userId,
            userIdType: typeof userId
        });

        const animal = await this.repository.getById(id);

        console.log('🔍 Use case DEBUG - Repository result:', {
            animalFound: !!animal,
            animalId: animal?.id,
            animalOwnerId: animal?.ownerId,
            animalOwnerIdType: typeof animal?.ownerId
        });

        if (!animal) {
            console.log('🔍 Use case DEBUG - Animal not found in DB');
            return null; 
        }

        console.log('🔍 Use case DEBUG - Comparing ownership:', {
            animalOwnerId: animal.ownerId,
            userId: userId,
            strictEqual: animal.ownerId === userId,
            looseEqual: animal.ownerId == userId,
            // Comparaciones adicionales para debug
            animalOwnerIdTrimmed: animal.ownerId?.toString().trim(),
            userIdTrimmed: userId?.toString().trim()
        });

        // ✅ CORRECCIÓN: Asegurar comparación correcta de strings
        const animalOwnerIdStr = animal.ownerId?.toString().trim();
        const userIdStr = userId?.toString().trim();

        if (animalOwnerIdStr !== userIdStr) {
            console.log('❌ Use case DEBUG - Ownership mismatch:', {
                animalOwnerIdStr,
                userIdStr,
                match: animalOwnerIdStr === userIdStr
            });
            throw new Error("Animal not found or does not belong to the user.");
        }

        console.log('✅ Use case DEBUG - Ownership verified, returning animal');
        return animal;
    }
}