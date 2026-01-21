import { Request, Response } from "express";
import cartModel from "../../../models/cart.model";

export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const { productId } = req.params;

        const cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Product not in cart",
            });
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Item removed from cart",
        });

    } catch (error) {
        console.error("Remove from cart (user) error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
