import mongoose from "mongoose";
import paymentModel from "../models/payment.model";
import Order from "../models/order.model";
import { createSafepayCheckoutUrl } from "../providers/safepay.provider";
import { CreatePaymentInput } from "../types/payment.types";

export const createPaymentService = async (
    userId: string,
    data: CreatePaymentInput
) => {
    // Step 1: Find the order and ensure it belongs to user
    const order = await Order.findOne({
        _id: data.orderId,
        user: new mongoose.Types.ObjectId(userId),
    });

    if (!order) {
        throw new Error("Order not found");
    }

    // Step 2: Prevent creating payment if already PAID
    if (order.status === "PAID") {
        throw new Error("Order already paid");
    }

    // Step 3: Mark existing PENDING payment as FAILED (if any)
    const existingPendingPayment = await paymentModel.findOne({
        orderId: order._id,
        status: "PENDING",
    });

    if (existingPendingPayment) {
        existingPendingPayment.status = "FAILED";
        await existingPendingPayment.save();
    }

    // Step 4: Create a new payment
    const payment = await paymentModel.create({
        userId: new mongoose.Types.ObjectId(userId),
        orderId: order._id,
        amount: order.totalAmount,
        currency: "PKR",
        status: "PENDING",
        provider: "safepay",
    });

    // Step 5: Generate SafePay checkout URL
    const checkoutUrl = await createSafepayCheckoutUrl({
        amount: payment.amount,
        paymentId: payment._id.toString(),
        orderId: order._id.toString(),
    });

    // Step 6: Save checkoutUrl in payment
    payment.checkoutUrl = checkoutUrl;
    await payment.save();

    return {
        payment,
        checkoutUrl,
    };
};