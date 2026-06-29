import { Order } from "../models";
import type { CreateOrderDTO } from "../schemas";

export class OrderService {
  static createOrder = async (data: CreateOrderDTO, userId: string) => {
    try {
      const order = await Order.create({ ...data, userId });
      return order;
    } catch (error) {
      throw new Error("Error creating order in database.");
    }
  };

  static getAllOrders = async (userId: string) => {
    try {
      const orders = await Order.find({ userId });
      return orders;
    } catch (error) {
      throw new Error("Error fetching orders from database.");
    }
  };

  static getMonthlySummary = async (userId: string) => {
    const result = await Order.aggregate([
      {
        $match: { userId },
      },

      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalSpent: { $sum: "$output.totalCost" },
          totalEarned: { $sum: "$output.totalToCharge" },
          orderCount: { $sum: 1 },
        },
      },

      {
        $sort: { "_id.year": -1, "_id.month": -1 },
      },

      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalSpent: 1,
          totalEarned: 1,
          totalProfit: { $subtract: ["$totalEarned", "$totalSpent"] },
          orderCount: 1,
        },
      },
    ]);

    return result;
  };

  static deleteOrder = async (id: string, userId: string) => {
    const deletedOrder = await Order.findByIdAndDelete({ _id: id, userId });
    return deletedOrder;
  };
}
