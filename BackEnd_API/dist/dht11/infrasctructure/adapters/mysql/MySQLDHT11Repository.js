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
exports.MySQLDHT11Repository = void 0;
const dht11_1 = require("../../../domain/dht11");
const mysqldb_1 = require("../../../../database/mysql/mysqldb");
class MySQLDHT11Repository {
    save(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield (0, mysqldb_1.testConnection)();
            try {
                const query = 'INSERT INTO dht11 (id, humidity, temperature) VALUES (1, ?, ?) ON DUPLICATE KEY UPDATE humidity = VALUES(humidity), temperature = VALUES(temperature)';
                yield connection.execute(query, [data.humidity, data.temperature]);
            }
            finally {
                connection.release();
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield (0, mysqldb_1.testConnection)();
            try {
                const [rows] = yield connection.execute('SELECT temperature, humidity FROM dht11');
                return rows.map(row => new dht11_1.DHT11(row.temperature, row.humidity));
            }
            finally {
                connection.release();
            }
        });
    }
    getDataById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield (0, mysqldb_1.testConnection)();
            try {
                const query = 'SELECT temperature, humidity FROM dht11 WHERE id = ?';
                const [rows] = yield connection.execute(query, [id]);
                const row = rows[0];
                if (!row) {
                    return null;
                }
                return new dht11_1.DHT11(row.temperature, row.humidity);
            }
            finally {
                connection.release();
            }
        });
    }
}
exports.MySQLDHT11Repository = MySQLDHT11Repository;
