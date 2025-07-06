import { Router } from "express";
import { onController, offController } from "../dependencies";

export const CameraRouter = Router();


CameraRouter.get('/on', onController.run.bind(onController));

CameraRouter.get('/off', offController.run.bind(offController)); 
