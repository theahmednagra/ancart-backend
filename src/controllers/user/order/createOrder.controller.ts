import { Request, Response } from "express";
import productModel from "../../../models/product.model";
import orderModel from "../../../models/order.model";

export const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const items = req.body;

        if (!items || !items.length) {
            return res.status(400).json({
                message: "Invalid order data",
            });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            // Atomic stock check and increment
            const product = await productModel.findOneAndUpdate(
                { _id: item.productId, isActive: true, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { new: true }
            );

            if (!product) {
                return res.status(400).json({
                    message: "Invalid or out of stock product",
                });
            }

            totalAmount += product.price * item.quantity;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
            });
        }

        const order = await orderModel.create({
            user: userId,
            items: orderItems,
            totalAmount,
        });

        return res.status(201).json({
            message: "Order placed successfully",
            order,
        });

    } catch (error) {
        console.error("Create order (user) error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}