import { Request, Response } from "express";
import cartModel from "../../../models/cart.model";

export const getCart = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;

        const cart = await cartModel.findOne({ user: userId })
            .populate("items.product", "name price slug image stock isActive");

        if (!cart) {
            return res.status(200).json({
                success: true,
                data: { items: [] },
            });
        }

        // Filter out inactive products from cart
        const filteredItems = cart.items.filter(
            item => item.product && (item.product as any).isActive
        );

        cart.items = filteredItems;
        await cart.save();

        res.status(200).json({
            success: true,
            data: { items: cart.items },
        });

    } catch (error) {
        console.error("Get cart (user) error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
