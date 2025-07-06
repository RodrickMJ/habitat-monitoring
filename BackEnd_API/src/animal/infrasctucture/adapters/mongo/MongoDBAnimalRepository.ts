import { dbMongo } from "../../../../database/mongo/mongodb";
import { Animal } from "../../../domain/Animal";
import { AnimalRepository } from "../../../domain/AnimalRepository";
import { ObjectId } from "mongodb";

export class MongodbAnimalRepository implements AnimalRepository {
    async getAll(): Promise<Animal[]> { 
        const animalCollection = dbMongo.collection('animals');
        const animals = await animalCollection.find().toArray();
        return animals.map(animal => new Animal(
            animal._id.toString(),
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
        const animalCollection = dbMongo.collection('animals');
        await animalCollection.insertOne(animal);
    }

    async getById(id: string): Promise<Animal | null> {
        const animalCollection = dbMongo.collection('animals');
        const animal = await animalCollection.findOne({ _id: new ObjectId(id) });
        if (animal) {
            return new Animal(
                animal._id.toString(),
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
        return null;
    }

    async getAnimalsByOwnerId(ownerId: string): Promise<Animal[]> {
        const animalCollection = dbMongo.collection('animals');
        const animals = await animalCollection.find({ ownerId }).toArray();
        return animals.map(animal => new Animal(
            animal._id.toString(),
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
