import { Request, Response } from "express";
import mongoose from "mongoose";
import paymentModel from "../../../models/payment.model";
import orderModel from "../../../models/order.model";

export const handleSafepayWebhook = async (req: Request, res: Response) => {
    try {
        // console.log("🔥 Webhook HIT");
        // console.log(JSON.stringify(req.body, null, 2));

        const { data } = req.body;
        const notification = data?.notification;

        if (!notification) {
            return res.status(400).json({ message: "Invalid payload: missing notification" });
        }

        const { tracker, state, metadata } = notification;

        // Safepay is sending payment _id in metadata
        const paymentId = metadata?.order_id;

        if (!paymentId) {
            return res.status(400).json({ message: "Payment ID missing in metadata" });
        }

        // Find payment by _id
        const payment = await paymentModel.findById(paymentId);

        if (!payment) {
            return res.status(404).json({ message: "Payment not found for this ID" });
        }

        // Prevent duplicate processing
        if (payment.status === "PAID") {
            return res.status(200).json({ message: "Payment already processed" });
        }

        // Update payment
        payment.status = state === "PAID" ? "PAID" : "FAILED";
        payment.paymentRef = tracker;
        payment.metadata = notification;
        await payment.save();
        // console.log("Payment updated successfully:", payment);

        // Update order status
        if (state === "PAID" && payment.orderId) {
            const updatedOrder = await orderModel.findByIdAndUpdate(
                payment.orderId,
                { status: "PAID" },
                { new: true }
            );
            // console.log("Order updated successfully:", updatedOrder);
        }

        return res.status(200).json({ message: "Webhook processed successfully" });
    } catch (error) {
        console.error("Webhook processing failed:", error);
        return res.status(500).json({ message: "Webhook failed", error: (error as Error).message });
    }
};