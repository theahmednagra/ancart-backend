import { Request, Response } from "express";
import { createPaymentService } from "../../../services/payment.service";

export const createPaymentController = async (req: Request, res: Response): Promise<any> => {
    try {
        const user = (req as any).user;
        
        const { orderId } = req.params;

        // Validate orderId
        if (!orderId || typeof orderId !== "string") {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        // Call service
        const result = await createPaymentService(user.id, { orderId });

        return res.status(201).json(result);
    } catch (error: any) {
        console.error(error);

        return res.status(500).json({
            message: error.message || "Failed to create payment",
        });
    }
};