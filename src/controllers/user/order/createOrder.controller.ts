import { Request, Response } from "express";
import mongoose from "mongoose";
import productModel from "../../../models/product.model";
import orderModel from "../../../models/order.model";
import { createPaymentService } from "../../../services/payment.service";

export const createOrder = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user!.id;
        const { orderData } = req.body;
        const { items } = req.body;

        // Order data validation
        if (!orderData) {
            throw new Error("Order data is required");
        }

        const { fullName, phone, addressLine, city, paymentMethod } = orderData;

        if (!fullName?.trim() || !phone?.trim() || !addressLine?.trim() || !city?.trim()) {
            throw new Error("Invalid order data")
        }

        // Items validation
        if (!items || !items.length) {
            throw new Error("Invalid order items data");
        }

        // Payment method validation
        if (!paymentMethod) {
            throw new Error("Invalid payment method data");
        }

        let totalAmount = 0;
        const orderItems: any[] = [];

        for (const item of items) {
            // Atomic stock check and increment
            const product = await productModel.findOneAndUpdate(
                { _id: item.productId, isActive: true, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { new: true, session }
            );

            if (!product) {
                throw new Error("Invalid or out of stock product")
            }

            totalAmount += product.price * item.quantity;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
            });
        }

        const [order] = await orderModel.create(
            [{
                user: userId,
                items: orderItems,
                orderData,
                totalAmount,
                status: "PENDING",
            }],
            { session }
        );

        await session.commitTransaction();

        if (paymentMethod === "CARD") {
            const { payment, checkoutUrl } = await createPaymentService(userId, { orderId: order._id.toString() });

            return res.status(201).json({
                message: "Order placed! Please confirm your payment",
                order,
                payment,
                checkoutUrl,
            })
        }

        return res.status(201).json({
            message: "Order placed successfully",
            order,
        });

    } catch (error) {
        await session.abortTransaction();

        console.error("Create order (user) error:", error);

        return res.status(400).json({
            message: error instanceof Error ? error.message : "Order failed",
        });

    } finally {
        session.endSession();
    }
}