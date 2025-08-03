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
exports.RegisterAnimalController = void 0;
const Animal_1 = require("../../domain/Animal");
class RegisterAnimalController {
    constructor(registerAnimalUseCase) {
        this.registerAnimalUseCase = registerAnimalUseCase;
    }
    run(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, breed, species, age, gender, color, size, notes } = req.body;
                const userId = req.user.id; // Obtener el ID del usuario desde la solicitud
                const animal = new Animal_1.Animal('', name, breed, species, age, gender, color, size, userId, notes);
                yield this.registerAnimalUseCase.registerAnimal(animal, userId);
                res.status(201).json({
                    message: 'Animal registered successfully',
                    success: true,
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                res.status(400).json({
                    message: errorMessage,
                    success: false,
                });
            }
        });
    }
}
exports.RegisterAnimalController = RegisterAnimalController;
