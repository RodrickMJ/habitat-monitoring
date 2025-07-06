import { Router } from "express";
import { registerAnimalController, getAllAnimalController, getByIdAnimalController } from "../dependencies";
import { authenticateJWT } from "../../../middlewares/Auth"; 

export const AnimalRouter = Router();

AnimalRouter.post('/register', authenticateJWT, registerAnimalController.run.bind(registerAnimalController));

AnimalRouter.get('/all', authenticateJWT, getAllAnimalController.run.bind(getAllAnimalController));

AnimalRouter.get('/:id', authenticateJWT, getByIdAnimalController.run.bind(getByIdAnimalController));
