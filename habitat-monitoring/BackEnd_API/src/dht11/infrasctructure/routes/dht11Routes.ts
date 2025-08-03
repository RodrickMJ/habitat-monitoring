import { Router } from "express";
import { getAllDataDHT11Controller, getDHT11ByIdController, saveDataDHT11Controller} from "../dependencies";


export const dhtRouter = Router();

dhtRouter.get('/all', getAllDataDHT11Controller.run.bind(getAllDataDHT11Controller));

dhtRouter.get('/data/:id', getDHT11ByIdController.run.bind(getDHT11ByIdController));

dhtRouter.post('/data', saveDataDHT11Controller.run.bind(saveDataDHT11Controller));

