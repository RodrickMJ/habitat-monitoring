import { GetDHT11ByIdUseCase } from "../application/GetDHT11DataByIdUseCase";
import { GetDataDHT11UseCase } from "../application/GetDHT11DataUseCase";
import { SaveDHT11DataUseCase } from "../application/SaveDHT11DataUseCase";
import { GetAllDataDHT11Controller } from "./controller/GetAllDataDHT11Controller";
import { GetDHT11ByIdController } from "./controller/GetByIdDataDHT11Controller";
import { SaveDataDHT11Controller } from "./controller/SaveDataDHT11Controller";
import { MySQLDHT11Repository } from "./adapters/mysql/MySQLDHT11Repository";


const dht11Repository: MySQLDHT11Repository = new MySQLDHT11Repository;

export const getDHT11ByIdUseCase = new GetDHT11ByIdUseCase(dht11Repository);
export const getDataDHT11UseCase = new GetDataDHT11UseCase(dht11Repository);
export const saveDHT11DataUseCase = new SaveDHT11DataUseCase(dht11Repository);

export const getAllDataDHT11Controller = new GetAllDataDHT11Controller(getDataDHT11UseCase);
export const getDHT11ByIdController = new GetDHT11ByIdController(getDHT11ByIdUseCase);
export const saveDataDHT11Controller = new SaveDataDHT11Controller(saveDHT11DataUseCase)