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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongodbUserRepository = void 0;
const mongodb_1 = require("../../../../database/mongo/mongodb");
const User_1 = require("../../../domain/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongodb_2 = require("mongodb");
class MongodbUserRepository {
    register(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userCollection = mongodb_1.dbMongo.collection('users');
            yield userCollection.insertOne(user);
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userCollection = mongodb_1.dbMongo.collection('users');
            const user = yield userCollection.findOne({ email });
            if (user) {
                const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
                if (isPasswordValid) {
                    return new User_1.User(user._id.toString(), user.name, user.lastname, user.email, user.password, user.animals, user.token);
                }
            }
            return null;
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const userCollection = mongodb_1.dbMongo.collection('users');
            const users = yield userCollection.find().toArray();
            return users.map(user => new User_1.User(user._id.toString(), user.name, user.lastname, user.email, user.password, user.animals, user.token));
        });
    }
    logout(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userCollection = mongodb_1.dbMongo.collection('users');
            yield userCollection.updateOne({ token }, { $set: { token: null } });
        });
    }
    updateToken(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userCollection = mongodb_1.dbMongo.collection('users');
            yield userCollection.updateOne({ _id: new mongodb_2.ObjectId(id) }, { $set: { token } });
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userCollection = mongodb_1.dbMongo.collection('users');
            const user = yield userCollection.findOne({ _id: new mongodb_2.ObjectId(id) });
            if (user) {
                return new User_1.User(user._id.toString(), user.name, user.lastname, user.email, user.password, user.animals, user.token);
            }
            return null;
        });
    }
}
exports.MongodbUserRepository = MongodbUserRepository;
