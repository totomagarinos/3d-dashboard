import type { Response } from "express";
import { parse } from "valibot";
import { OrderService } from "../services";
import { CreateOrderSchema } from "../schemas";
import type { AuthenticatedRequest } from "../middlewares/auth";

const isCastError = (error: unknown): error is Error & { name: "CastError" } =>
  error instanceof Error && error.name === "CastError";

export class OrderController {
  static create = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const validatedData = parse(CreateOrderSchema, req.body);
      const userId = (req.user as { userId: string }).userId;

      const newOrder = await OrderService.createOrder(validatedData, userId);

      res.status(201).json(newOrder);
    } catch (error) {
      res.status(400).json({ error: "Invalid data or server error." });
    }
  };

  static getAll = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = (req.user as { userId: string }).userId;

      const orders = await OrderService.getAllOrders(userId);

      res.status(200).json(orders);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Internal server error while fetching orders." });
    }
  };

  static getSummary = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = (req.user as { userId: string }).userId;

      const summary = await OrderService.getMonthlySummary(userId);

      res.status(200).json(summary);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Internal server error while fetching orders." });
    }
  };

  static delete = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      if (typeof id !== "string") {
        return res.status(400).json({ error: "ID is required" });
      }

      const userId = (req.user as { userId: string }).userId;

      const deletedOrder = await OrderService.deleteOrder(id, userId);

      if (!deletedOrder) {
        return res.status(404).json({ error: "Order not found." });
      }

      return res.status(200).json(deletedOrder);
    } catch (error) {
      if (isCastError(error)) {
        return res.status(400).json({ error: "Invalid order ID." });
      }

      return res.status(500).json({ error: "Error deleting order." });
    }
  };
}
