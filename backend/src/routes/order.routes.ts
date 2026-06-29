import { Router } from "express";
import { OrderController } from "../controllers";
import { authenticateToken } from "../middlewares/auth";

export const orderRouter = Router();

orderRouter.use(authenticateToken);

orderRouter.get("/", OrderController.getAll);
orderRouter.get("/summary", OrderController.getSummary);
orderRouter.post("/", OrderController.create);
orderRouter.delete("/:id", OrderController.delete);
