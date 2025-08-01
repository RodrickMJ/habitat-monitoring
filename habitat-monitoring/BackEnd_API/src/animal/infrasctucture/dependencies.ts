import { RegisterAnimalController } from "./controller/RegisterAnimalController";
import { GetAllAnimalController } from "./controller/GetAllAnimalController";
import { GetByIdAnimalController } from "./controller/GetByIdAnimalController";
import { RegisterAnimalUseCase } from "../application/RegisterAnimalUseCase";
import { GetAllAnimalUseCase } from "../application/GetAllAnimalUseCase";
import { GetByIdAnimalUseCase } from "../application/GetByIdAnimalUseCase";
import { MysqlAnimalRepository } from "./adapters/mysql/MySqlDBAnimalRepository";
import { AnimalRepository } from "../domain/AnimalRepository";

const animalRepository: AnimalRepository = new MysqlAnimalRepository();

export const registerAnimalUseCase = new RegisterAnimalUseCase(animalRepository);
export const getAllAnimalUseCase = new GetAllAnimalUseCase(animalRepository);
export const getByIdAnimalUseCase = new GetByIdAnimalUseCase(animalRepository);

export const registerAnimalController = new RegisterAnimalController(registerAnimalUseCase);
export const getAllAnimalController = new GetAllAnimalController(getAllAnimalUseCase);
export const getByIdAnimalController = new GetByIdAnimalController(getByIdAnimalUseCase);
