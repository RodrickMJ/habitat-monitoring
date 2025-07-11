"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraRouter = void 0;
const express_1 = require("express");
const dependencies_1 = require("../dependencies");
exports.CameraRouter = (0, express_1.Router)();
exports.CameraRouter.get('/on', dependencies_1.onController.run.bind(dependencies_1.onController));
exports.CameraRouter.get('/off', dependencies_1.offController.run.bind(dependencies_1.offController));
