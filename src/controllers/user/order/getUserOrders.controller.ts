import { Request, Response } from "express";
import orderModel from "../../../models/order.model";

export const getUserOrders = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;

        const orders = await orderModel.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("items.product", "name slug image");

        return res.status(200).json({
            success: true,
            data: orders,
        });

    } catch (error) {
        console.error("Get orders (user) error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}