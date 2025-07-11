"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongodbAnimalRepository = void 0;
const mongodb_1 = require("../../../../database/mongo/mongodb");
const Animal_1 = require("../../../domain/Animal");
const mongodb_2 = require("mongodb");
class MongodbAnimalRepository {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const animalCollection = mongodb_1.dbMongo.collection('animals');
            const animals = yield animalCollection.find().toArray();
            return animals.map(animal => new Animal_1.Animal(animal._id.toString(), animal.name, animal.breed, animal.species, animal.age, animal.gender, animal.color, animal.size, animal.ownerId, animal.notes));
        });
    }
    registerAnimal(animal) {
        return __awaiter(this, void 0, void 0, function* () {
            const animalCollection = mongodb_1.dbMongo.collection('animals');
            yield animalCollection.insertOne(animal);
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const animalCollection = mongodb_1.dbMongo.collection('animals');
            const animal = yield animalCollection.findOne({ _id: new mongodb_2.ObjectId(id) });
            if (animal) {
                return new Animal_1.Animal(animal._id.toString(), animal.name, animal.breed, animal.species, animal.age, animal.gender, animal.color, animal.size, animal.ownerId, animal.notes);
            }
            return null;
        });
    }
    getAnimalsByOwnerId(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const animalCollection = mongodb_1.dbMongo.collection('animals');
            const animals = yield animalCollection.find({ ownerId }).toArray();
            return animals.map(animal => new Animal_1.Animal(animal._id.toString(), animal.name, animal.breed, animal.species, animal.age, animal.gender, animal.color, animal.size, animal.ownerId, animal.notes));
        });
    }
}
exports.MongodbAnimalRepository = MongodbAnimalRepository;
