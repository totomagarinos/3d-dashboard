import { Router } from "express";
import { OrderController } from "../controllers";

export const orderRouter = Router();

orderRouter.get("/", OrderController.getAll);
orderRouter.get("/summary", OrderController.getSummary);
orderRouter.post("/", OrderController.create);
orderRouter.delete("/:id", OrderController.delete);
