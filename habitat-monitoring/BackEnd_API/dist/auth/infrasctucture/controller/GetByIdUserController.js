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
exports.GetUserByIdController = void 0;
class GetUserByIdController {
    constructor(useCase) {
        this.useCase = useCase;
    }
    run(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const user = yield this.useCase.execute(userId);
                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                const response = {
                    id: user.id,
                    name: user.name,
                    lastname: user.lastname,
                    email: user.email,
                    animals: user.animals.map((animal) => ({
                        id: animal.id,
                        name: animal.name,
                        breed: animal.breed,
                        species: animal.species,
                        age: animal.age,
                        gender: animal.gender,
                        color: animal.color,
                        size: animal.size,
                        notes: animal.notes // Asegúrate de que este campo sea una cadena
                    }))
                };
                res.status(200).json(response);
            }
            catch (error) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.GetUserByIdController = GetUserByIdController;
