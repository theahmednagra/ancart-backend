import { Request, Response } from "express";
import orderModel from "../../../models/order.model";

export const getOrderById = async (req: Request, res: Response) => {
    const { orderId } = req.params;

    try {
        const order = await orderModel.findById(orderId)
            .populate("user", "fullname email")
            .populate("items.product", "name price");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            data: order,
        });

    } catch (error) {
        res.status(500).json({
            message: "Interval server error",
        });
    }
};
