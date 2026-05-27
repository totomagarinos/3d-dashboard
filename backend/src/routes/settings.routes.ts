import { Router } from "express";
import { SettingsController } from "../controllers";

export const settingsRouter = Router();

settingsRouter.get("/", SettingsController.get);
settingsRouter.patch("/", SettingsController.update);
