import { OnController } from "./controller/OnController";
import { OffController } from "./controller/OffController";
import { CameraOffUseCase } from "../application/CameraOffUseCase";
import { CameraOnUseCase } from "../application/CameraOnUseCase";
import { MysqlCameraRepository } from "./adapters/mysql/MySQLCameraRepository";
import { CameraRepository } from "../domain/CameraRepository";
import dotenv from 'dotenv';

dotenv.config();

const cameraRepository: CameraRepository = new MysqlCameraRepository();

export const cameraOffUseCase = new CameraOffUseCase(cameraRepository);
export const cameraOnUseCase = new CameraOnUseCase(cameraRepository);

export const onController = new OnController(cameraOnUseCase);
export const offController = new OffController(cameraOffUseCase);
