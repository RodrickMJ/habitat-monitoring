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
exports.MysqlCameraRepository = void 0;
const mysqldb_1 = require("../../../../database/mysql/mysqldb");
class MysqlCameraRepository {
    on() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield (0, mysqldb_1.testConnection)();
            const sql = 'UPDATE cameras SET isCameraOn = ? WHERE id = ?';
            yield connection.execute(sql, [true, 1]);
            console.log('Camera is turned on.');
        });
    }
    off() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield (0, mysqldb_1.testConnection)();
            const sql = 'UPDATE cameras SET isCameraOn = ? WHERE id = ?';
            yield connection.execute(sql, [false, 1]);
            console.log('Camera is turned off.');
        });
    }
}
exports.MysqlCameraRepository = MysqlCameraRepository;
