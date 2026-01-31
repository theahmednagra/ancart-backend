import { Request, Response } from "express";
import cartModel from "../../../models/cart.model";
import productModel from "../../../models/product.model";

export const updateCartQuantity = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const { productId, quantity } = req.body;

        // Validation
        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({
                message: "Invalid input",
            });
        }

        // Check if product exists and is active
        const product = await productModel.findOne({ _id: productId, isActive: true });
        if (!product) {
            return res.status(404).json({
                message: "Product not available",
            });
        }

        // Check stock
        if (quantity > product.stock) {
            return res.status(400).json({
                message: `Only ${product.stock} items available in stock`,
            });
        }

        // Find cart
        let cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            // If no cart exists, create new cart with item
            cart = await cartModel.create({
                user: userId,
                items: [{ product: productId, quantity }],
            });
        } else {
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (itemIndex > -1) {
                // Update quantity
                cart.items[itemIndex].quantity = quantity;
            } else {
                // Add new item
                cart.items.push({ product: productId, quantity });
            }

            await cart.save();
        }

        res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            data: cart,
        });

    } catch (error) {
        console.error("Update cart quantity error:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};
