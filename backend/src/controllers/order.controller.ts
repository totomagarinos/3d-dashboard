import type { Request, Response } from "express";
import { parse } from "valibot";
import { OrderService } from "../services";
import { CreateOrderSchema } from "../schemas";

const isCastError = (error: unknown): error is Error & { name: "CastError" } =>
  error instanceof Error && error.name === "CastError";

export class OrderController {
  static create = async (req: Request, res: Response) => {
    try {
      const validatedData = parse(CreateOrderSchema, req.body);

      const newOrder = await OrderService.createOrder(validatedData);

      res.status(201).json(newOrder);
    } catch (error) {
      res.status(400).json({ error: "Invalid data or server error." });
    }
  };

  static getAll = async (req: Request, res: Response) => {
    try {
      const orders = await OrderService.getAllOrders();

      res.status(200).json(orders);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Internal server error while fetching orders." });
    }
  };

  static getSummary = async (req: Request, res: Response) => {
    try {
      const summary = await OrderService.getMonthlySummary();

      res.status(200).json(summary);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Internal server error while fetching orders." });
    }
  };

  static delete = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;
      const deletedOrder = await OrderService.deleteOrder(id);

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
