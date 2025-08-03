"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoose = exports.dbMongo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.mongoose = mongoose_1.default;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoURI = process.env.MONGO_URI;
mongoose_1.default.connect(mongoURI)
    .then(() => {
    console.log("");
})
    .catch((error) => {
    console.error(error);
});
const dbMongo = mongoose_1.default.connection;
exports.dbMongo = dbMongo;
dbMongo.on("error", console.error.bind(console, "connection error:"));
