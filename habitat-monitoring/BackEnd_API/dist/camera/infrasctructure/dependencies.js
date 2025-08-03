"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.offController = exports.onController = exports.cameraOnUseCase = exports.cameraOffUseCase = void 0;
const OnController_1 = require("./controller/OnController");
const OffController_1 = require("./controller/OffController");
const CameraOffUseCase_1 = require("../application/CameraOffUseCase");
const CameraOnUseCase_1 = require("../application/CameraOnUseCase");
const MySQLCameraRepository_1 = require("./adapters/mysql/MySQLCameraRepository");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cameraRepository = new MySQLCameraRepository_1.MysqlCameraRepository();
exports.cameraOffUseCase = new CameraOffUseCase_1.CameraOffUseCase(cameraRepository);
exports.cameraOnUseCase = new CameraOnUseCase_1.CameraOnUseCase(cameraRepository);
exports.onController = new OnController_1.OnController(exports.cameraOnUseCase);
exports.offController = new OffController_1.OffController(exports.cameraOffUseCase);
