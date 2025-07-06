import { RegisterController } from "./controller/RegisterController";
import { LoginController } from "./controller/LoginController";
import { GetAllUsersWithAnimalsController } from "./controller/GetAllUsersWithAnimalsController";
import { LogOutController } from "./controller/LogOutController";
import { GetUserByIdController } from "./controller/GetByIdUserController";
import { RegisterUserUseCase } from "../application/RegisterUserUserCase";
import { LoginUserUseCase } from "../application/LoginUserUseCase";
import { GetAllUsersWithAnimalsUseCase } from "../application/GetAllUsersWithAnimalsUseCase ";
import { LogOutUseCase } from "../application/LogOutUseCase";
import { GetUserByIdUseCase } from "../application/GetByIdUserUseCase";
import { MysqlUserRepository } from "../infrasctucture/adapters/mysql/MySqlDBUserRepository";
import { MysqlAnimalRepository } from "../../animal/infrasctucture/adapters/mysql/MySqlDBAnimalRepository"; // Importa el repositorio de animales para MySQL
import { UserRepository } from "../domain/UserRepository";
import { AnimalRepository } from "../../animal/domain/AnimalRepository";
import dotenv from 'dotenv';

dotenv.config();

const userRepository: UserRepository = new MysqlUserRepository();
const animalRepository: AnimalRepository = new MysqlAnimalRepository();

export const registerUserUseCase = new RegisterUserUseCase(userRepository);
export const loginUserUseCase = new LoginUserUseCase(userRepository);
export const logoutUseCase = new LogOutUseCase(userRepository);
export const getAllUsersWithAnimalsUseCase = new GetAllUsersWithAnimalsUseCase(userRepository, animalRepository);
export const getUserById = new GetUserByIdUseCase(userRepository)

export const registerController = new RegisterController(registerUserUseCase);
export const loginController = new LoginController(loginUserUseCase);
export const getAllUsersWithAnimalsController = new GetAllUsersWithAnimalsController(getAllUsersWithAnimalsUseCase);
export const logoutController = new LogOutController(logoutUseCase);
export const getUserByIdController = new GetUserByIdController(getUserById);
