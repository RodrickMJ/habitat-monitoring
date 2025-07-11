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
exports.MysqlUserRepository = void 0;
const User_1 = require("../../../domain/User");
const Animal_1 = require("../../../../animal/domain/Animal");
const mysqldb_1 = require("../../../../database/mysql/mysqldb");
class MysqlUserRepository {
    register(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield (0, mysqldb_1.testConnection)();
            const sql = 'INSERT INTO users (name, lastname, email, password) VALUES (?, ?, ?, ?)';
            yield connection.execute(sql, [user.name, user.lastname, user.email, user.password]);
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield (0, mysqldb_1.testConnection)();
            const sql = 'SELECT * FROM users WHERE email = ?';
            const [rows] = yield connection.execute(sql, [email]);
            const users = rows;
            if (users.length === 0) {
                return null;
            }
            const user = users[0];
            return new User_1.User(user.id, user.name, user.lastname, user.email, user.password, user.animals, user.token);
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield (0, mysqldb_1.testConnection)();
            const sql = 'SELECT * FROM users';
            const [rows] = yield connection.execute(sql);
            const users = rows;
            return users.map(user => new User_1.User(user.id, user.name, user.lastname, user.email, user.password, user.animals, user.token));
        });
    }
    logout(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield (0, mysqldb_1.testConnection)();
            const sql = 'UPDATE users SET token = NULL WHERE token = ?';
            yield connection.execute(sql, [token]);
        });
    }
    updateToken(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield (0, mysqldb_1.testConnection)();
            const sql = 'UPDATE users SET token = ? WHERE id = ?';
            yield connection.execute(sql, [token, id]);
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield (0, mysqldb_1.testConnection)();
            const sql = 'SELECT * FROM users WHERE id = ?';
            const [rows] = yield connection.execute(sql, [id]);
            const users = rows;
            if (users.length === 0) {
                return null;
            }
            const user = users[0];
            // Asegúrate de que todos los datos se recuperan correctamente
            const animalSql = 'SELECT * FROM animals WHERE ownerId = ?';
            const [animalsRows] = yield connection.execute(animalSql, [id]);
            const animals = animalsRows;
            const mappedAnimals = animals.map(animal => new Animal_1.Animal(animal.id, animal.name, animal.breed, // Verifica que estos campos correspondan
            animal.species, animal.age, animal.gender, animal.color, animal.size, animal.ownerId, // Asegúrate de que `ownerId` esté presente
            animal.notes // Verifica que `notes` sea una cadena
            ));
            return new User_1.User(user.id, user.name, user.lastname, user.email, user.password, mappedAnimals, user.token);
        });
    }
}
exports.MysqlUserRepository = MysqlUserRepository;
