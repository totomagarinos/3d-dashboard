import { Router } from "express";
import { MaterialController } from "../controllers";
import { authenticateToken } from "../middlewares/auth";

export const materialRouter = Router();

materialRouter.use(authenticateToken);

materialRouter.post("/", MaterialController.create);
materialRouter.get("/", MaterialController.getAll);
materialRouter.patch("/:id", MaterialController.update);
materialRouter.delete("/:id", MaterialController.delete);
