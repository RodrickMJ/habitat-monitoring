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
exports.MongoDBCameraRepository = void 0;
const mongodb_1 = require("../../../../database/mongo/mongodb");
const mongodb_2 = require("mongodb");
class MongoDBCameraRepository {
    constructor() {
        this.isCameraOn = false;
    }
    on() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isCameraOn = true;
            const cameraCollection = mongodb_1.dbMongo.collection('cameras');
            yield cameraCollection.updateOne({ _id: new mongodb_2.ObjectId("60d5ec49f0c9b15de4c88c8b") }, { $set: { isCameraOn: this.isCameraOn } }, { upsert: true });
            console.log('Camera is turned on.');
        });
    }
    off() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isCameraOn = false;
            const cameraCollection = mongodb_1.dbMongo.collection('cameras');
            yield cameraCollection.updateOne({ _id: new mongodb_2.ObjectId("60d5ec49f0c9b15de4c88c8b") }, { $set: { isCameraOn: this.isCameraOn } }, { upsert: true });
            console.log('Camera is turned off.');
        });
    }
}
exports.MongoDBCameraRepository = MongoDBCameraRepository;
