import { Request, Response } from "express";
import orderModel from "../../../models/order.model";
import productModel from "../../../models/product.model";

export const cancelOrder = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { orderId } = req.params;

    const order = await orderModel.findOne({ _id: orderId, user: userId });
    if (!order) {
        return res.status(404).json({
            message: "Order not found",
        });
    }

    if (order.status === "CANCELLED") {
        return res.status(400).json({
            message: "Order already cancelled",
        });
    }

    // Only allow cancellation if order is pending or confirmed
    if (!["PENDING", "CONFIRMED"].includes(order.status)) {
        return res.status(400).json({
            message: "Cannot cancel at this stage",
        });
    }

    // Restore stock
    for (const item of order.items) {
        await productModel.updateOne(
            { _id: item.product },
            { $inc: { stock: item.quantity } }
        );
    }

    order.status = "CANCELLED";
    await order.save();

    res.status(200).json({
        success: true,
        message: "Order cancelled and stock restored",
        data: order,
    });
};
