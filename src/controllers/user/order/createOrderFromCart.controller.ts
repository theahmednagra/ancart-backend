import { Request, Response } from "express";
import cartModel from "../../../models/cart.model";
import productModel from "../../../models/product.model";
import orderModel from "../../../models/order.model";

export const createOrderFromCart = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;

        // 1. Get user cart
        const cart = await cartModel.findOne({ user: userId })
            .populate("items.product", "name price stock isActive");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty",
            });
        }

        // 2. Validate items and prepare order snapshot
        let totalAmount = 0;
        const orderItems = [];

        for (const item of cart.items) {
            const product = item.product as any;

            if (!product.isActive || product.stock < item.quantity) {
                return res.status(400).json({
                    message: `${product.name} is unavailable or out of stock`,
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

        // 3. Deduct stock atomically
        for (const item of cart.items) {
            const product = item.product as any;

            await productModel.updateOne(
                { _id: product._id, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } }
            );
        }

        // 4. Create order
        const order = await orderModel.create({
            user: userId,
            items: orderItems,
            totalAmount,
        });

        // 5. Clear cart
        cart.items = [];
        await cart.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: order,
        });

    } catch (error) {
        console.error("Create order from cart (user) error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}