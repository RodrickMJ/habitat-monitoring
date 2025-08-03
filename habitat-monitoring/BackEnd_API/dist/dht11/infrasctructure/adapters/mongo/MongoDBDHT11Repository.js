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
exports.DHT11RepositoryMongo = void 0;
const mongodb_1 = require("../../../../database/mongo/mongodb");
class DHT11RepositoryMongo {
    constructor() {
        this.collection = mongodb_1.dbMongo.collection('dht11');
    }
    save(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.collection.insertOne(data);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.collection.find().toArray();
        });
    }
    getDataById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.collection.findOne({ id });
            return result || null;
        });
    }
}
exports.DHT11RepositoryMongo = DHT11RepositoryMongo;
