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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserUseCase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const Auth_1 = require("../../middlewares/Auth");
class LoginUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.login(email, password);
            if (!user) {
                throw new Error("Invalid email or password");
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Invalid email or password");
            }
            const token = (0, Auth_1.generateToken)({ id: user.id, email: user.email });
            if (!token) {
                throw new Error("Token generation failed");
            }
            user.token = token;
            yield this.userRepository.updateToken(user.id, token);
            yield this.postLoginFunction(user.id);
            return { id: user.id, token };
        });
    }
    postLoginFunction(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Función ejecutada después del inicio de sesión para el usuario ${userId}`);
        });
    }
}
exports.LoginUserUseCase = LoginUserUseCase;
