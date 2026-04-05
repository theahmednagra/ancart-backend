import { Request, Response } from "express";
import orderModel from "../../../models/order.model";

const STATUS_FLOW: Record<string, string[]> = {
    PENDING: ["CONFIRMED"],
    PAID: ["CONFIRMED"],
    CONFIRMED: ["SHIPPED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { status: newStatus } = req.body;

        if (!newStatus) {
            return res.status(400).json({
                message: "New status is required",
            });
        }

        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        const currentStatus = order.status;

        // Prevent using this route for cancellations to ensure stock is restored via the correct controller
        if (newStatus === "CANCELLED") {
            return res.status(400).json({
                message: "Please use the specialized cancellation route to cancel this order.",
            });
        }

        // Block Admin from confirming a CARD order that hasn't been paid yet
        if (currentStatus === "PENDING" && newStatus === "CONFIRMED") {
            if (order.orderData.paymentMethod === "CARD") {
                return res.status(403).json({
                    message: "Cannot confirm a CARD order manually while it is PENDING. Payment must be completed first.",
                });
            }
        }

        const allowedNextStatuses = STATUS_FLOW[currentStatus] || [];

        if (!allowedNextStatuses.includes(newStatus)) {
            return res.status(400).json({
                message: `Invalid status transition from ${currentStatus} to ${newStatus}`,
            });
        }

        order.status = newStatus;
        await order.save();

        return res.status(200).json({
            message: `Order status updated from ${currentStatus} to ${newStatus}`,
            order,
        });

    } catch (error) {
        console.error("Update order status (admin) error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};