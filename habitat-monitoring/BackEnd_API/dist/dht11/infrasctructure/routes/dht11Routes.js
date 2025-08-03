"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dhtRouter = void 0;
const express_1 = require("express");
const dependencies_1 = require("../dependencies");
exports.dhtRouter = (0, express_1.Router)();
exports.dhtRouter.get('/all', dependencies_1.getAllDataDHT11Controller.run.bind(dependencies_1.getAllDataDHT11Controller));
exports.dhtRouter.get('/data/:id', dependencies_1.getDHT11ByIdController.run.bind(dependencies_1.getDHT11ByIdController));
exports.dhtRouter.post('/data', dependencies_1.saveDataDHT11Controller.run.bind(dependencies_1.saveDataDHT11Controller));
