import { Request, Response } from "express";
import cartModel from "../../../models/cart.model";

export const clearCart = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;

        const cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart cleared",
        });
        
    } catch (error) {
        console.error("Clear cart (user) error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};