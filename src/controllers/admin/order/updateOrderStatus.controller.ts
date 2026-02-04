import { Request, Response } from "express";
import orderModel from "../../../models/order.model";

const STATUS_FLOW: Record<string, string[]> = {
    PENDING: ["CONFIRMED"],
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

        const allowedNextStatuses = STATUS_FLOW[currentStatus];

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



// import { Request, Response } from "express";
// import orderModel from "../../../models/order.model";

// export const updateOrderStatus = async (req: Request, res: Response) => {
//     try {
//         const { orderId } = req.params;
//         const { status } = req.body;

//         const allowedStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

//         if (!allowedStatuses.includes(status)) {
//             return res.status(400).json({
//                 message: "Invalid order status",
//             });
//         }

//         const order = await orderModel.findById(orderId);

//         if (!order) {
//             return res.status(404).json({
//                 message: "Order not found",
//             });
//         }

//         order.status = status;
//         await order.save();

//         return res.status(200).json({
//             message: `Order status updated to ${status}`,
//         });

//     } catch (error) {
//         console.error("Update order status (admin) error:", error);
//         return res.status(500).json({
//             message: "Internal server error",
//         });
//     }
// }