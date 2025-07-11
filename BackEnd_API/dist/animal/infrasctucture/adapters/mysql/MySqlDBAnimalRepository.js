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
exports.MysqlAnimalRepository = void 0;
const Animal_1 = require("../../../domain/Animal");
const mysqldb_1 = require("../../../../database/mysql/mysqldb");
class MysqlAnimalRepository {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield (0, mysqldb_1.testConnection)();
            const sql = 'SELECT * FROM animals';
            const [rows] = yield connection.execute(sql);
            const animals = rows;
            return animals.map(animal => new Animal_1.Animal(animal.id, animal.name, animal.breed, animal.species, animal.age, animal.gender, animal.color, animal.size, animal.ownerId, animal.notes));
        });
    }
    registerAnimal(animal) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield (0, mysqldb_1.testConnection)();
            const sql = 'INSERT INTO animals (name, breed, species, age, gender, color, size, ownerId, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            yield connection.execute(sql, [animal.name, animal.breed, animal.species, animal.age, animal.gender, animal.color, animal.size, animal.ownerId, animal.notes]);
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield (0, mysqldb_1.testConnection)();
            const sql = 'SELECT * FROM animals WHERE id = ?';
            const [rows] = yield connection.execute(sql, [id]);
            const animals = rows;
            if (animals.length === 0) {
                return null;
            }
            const animal = animals[0];
            return new Animal_1.Animal(animal.id, animal.name, animal.breed, animal.species, animal.age, animal.gender, animal.color, animal.size, animal.ownerId, animal.notes);
        });
    }
    getAnimalsByOwnerId(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield (0, mysqldb_1.testConnection)();
            const sql = 'SELECT * FROM animals WHERE ownerId = ?';
            const [rows] = yield connection.execute(sql, [ownerId]);
            const animals = rows;
            return animals.map(animal => new Animal_1.Animal(animal.id, animal.name, animal.breed, animal.species, animal.age, animal.gender, animal.color, animal.size, animal.ownerId, animal.notes));
        });
    }
}
exports.MysqlAnimalRepository = MysqlAnimalRepository;
