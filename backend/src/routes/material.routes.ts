import { Router } from "express";
import { MaterialController } from "../controllers";

export const materialRouter = Router();

materialRouter.post("/", MaterialController.create);
materialRouter.get("/", MaterialController.getAll);
materialRouter.patch("/:id", MaterialController.update);
materialRouter.delete("/:id", MaterialController.delete);
