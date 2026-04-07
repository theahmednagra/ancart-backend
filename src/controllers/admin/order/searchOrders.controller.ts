import { Request, Response } from "express";
import orderModel from "../../../models/order.model";

export const searchOrders = async (req: Request, res: Response) => {
    try {
        const searchQuery = (req.query.q as string) || "";
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Number(req.query.limit) || 10, 20);
        const skip = (page - 1) * limit;

        if (!searchQuery.trim()) {
            return res.status(400).json({
                message: "Invalid search data",
            });
        }

        // Search using orderId (string, safe for regex)
        const query = {
            orderId: {
                $regex: `^${searchQuery.toUpperCase()}`, // faster + matches start
                $options: "i",
            },
        };

        const orders = await orderModel
            .find(query)
            .populate("user", "fullname email")
            .populate("items.product", "name price image")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({ orders, page });

    } catch (error) {
        console.error("Search orders (admin) error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};