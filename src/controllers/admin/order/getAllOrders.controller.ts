import { Request, Response } from "express";
import orderModel from "../../../models/order.model";

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await orderModel.find()
            .populate("user", "fullname email")
            .populate("items.product", "name price")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });

    } catch (error) {
        console.error("Get all orders (admin) error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}