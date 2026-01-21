import { Request, Response } from "express";
import productModel from "../../../models/product.model";

export const listProducts = async (req: Request, res: Response) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Number(req.query.limit) || 10, 50);
        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            productModel.find()
                .populate("category", "name slug")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            productModel.countDocuments(),
        ]);

        return res.status(200).json({
            page,
            limit,
            total,
            products,
        });

    } catch (error) {
        console.error("List products (admin) error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}