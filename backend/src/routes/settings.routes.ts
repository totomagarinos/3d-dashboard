import { Router } from "express";
import { SettingsController } from "../controllers";
import { authenticateToken } from "../middlewares/auth";

export const settingsRouter = Router();

settingsRouter.use(authenticateToken);

settingsRouter.get("/", SettingsController.get);
settingsRouter.patch("/", SettingsController.update);
