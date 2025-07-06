import { Animal } from '../../../domain/Animal';
import { AnimalRepository } from '../../../domain/AnimalRepository';
import { testConnection } from '../../../../database/mysql/mysqldb';

export class MysqlAnimalRepository implements AnimalRepository {
    async getAll(): Promise<Animal[]> {
        const connection = await testConnection();
        const sql = 'SELECT * FROM animals';
        const [rows] = await connection.execute(sql);
        const animals = rows as any[];

        return animals.map(animal => new Animal(
            animal.id,
            animal.name,
            animal.breed,
            animal.species,
            animal.age,
            animal.gender,
            animal.color,
            animal.size,
            animal.ownerId,
            animal.notes
        ));
    }

    async registerAnimal(animal: Animal): Promise<void> {
        const connection = await testConnection();

        const sql = 'INSERT INTO animals (name, breed, species, age, gender, color, size, ownerId, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await connection.execute(sql, [animal.name, animal.breed, animal.species, animal.age, animal.gender, animal.color, animal.size, animal.ownerId, animal.notes]);
    }

    async getById(id: string): Promise<Animal | null> {
        const connection = await testConnection();
        const sql = 'SELECT * FROM animals WHERE id = ?';
        const [rows] = await connection.execute(sql, [id]);
        const animals = rows as any[];

        if (animals.length === 0) {
            return null;
        }

        const animal = animals[0];
        return new Animal(
            animal.id,
            animal.name,
            animal.breed,
            animal.species,
            animal.age,
            animal.gender,
            animal.color,
            animal.size,
            animal.ownerId,
            animal.notes
        );
    }

    async getAnimalsByOwnerId(ownerId: string): Promise<Animal[]> {
        const connection = await testConnection();
        const sql = 'SELECT * FROM animals WHERE ownerId = ?';
        const [rows] = await connection.execute(sql, [ownerId]);
        const animals = rows as any[];

        return animals.map(animal => new Animal(
            animal.id,
            animal.name,
            animal.breed,
            animal.species,
            animal.age,
            animal.gender,
            animal.color,
            animal.size,
            animal.ownerId,
            animal.notes
        ));
    }
}
