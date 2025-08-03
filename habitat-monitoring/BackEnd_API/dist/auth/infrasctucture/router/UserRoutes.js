"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const dependencies_1 = require("../dependencies"); // Asegúrate de que `getUserByIdController` está importado
const Auth_1 = require("../../../middlewares/Auth");
exports.UserRouter = (0, express_1.Router)();
exports.UserRouter.post('/login', dependencies_1.loginController.run.bind(dependencies_1.loginController));
exports.UserRouter.post('/register', dependencies_1.registerController.run.bind(dependencies_1.registerController));
exports.UserRouter.get('/all', dependencies_1.getAllUsersWithAnimalsController.run.bind(dependencies_1.getAllUsersWithAnimalsController));
exports.UserRouter.post('/logout', Auth_1.authenticateJWT, dependencies_1.logoutController.run.bind(dependencies_1.logoutController));
exports.UserRouter.get('/:id', Auth_1.authenticateJWT, dependencies_1.getUserByIdController.run.bind(dependencies_1.getUserByIdController));
