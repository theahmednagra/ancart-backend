import { Request, Response } from "express";
import productModel from "../../../models/product.model";
import cartModel from "../../../models/cart.model";

export const addToCart = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({
                message: "Invalid cart input",
            });
        }

        const product = await productModel.findOne({ _id: productId, isActive: true });

        if (!product) {
            return res.status(404).json({
                message: "Product not available",
            });
        }

        let cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            cart = await cartModel.create({
                user: userId,
                items: [{ product: productId, quantity }]
            });

        } else {
            const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;

            } else {
                cart.items.push({ product: productId, quantity });
            }

            await cart.save();

            return res.status(200).json({
                success: true,
                message: "Item added to cart",
            });

        }

    } catch (error) {
        console.error("Add to cart (user) error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}