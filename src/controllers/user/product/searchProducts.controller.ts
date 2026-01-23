import { Request, Response } from "express";
import productModel from "../../../models/product.model";

export const searchProducts = async (req: Request, res: Response) => {
    try {
        const searchQuery = (req.query.q as string) || "";
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Number(req.query.limit) || 10, 20);
        const skip = (page - 1) * limit;

        if (!searchQuery.trim()) {
            return res.status(400).json({
                message: "Invalid search data",
            });
        }

        const products = await productModel.find({ isActive: true, stock: { $gt: 0 }, name: { $regex: searchQuery, $options: "i" } })
            .populate("category", "name slug")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: products.length,
            page,
            data: products,
        });

    } catch (error) {
        console.error("Search products (public) error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}