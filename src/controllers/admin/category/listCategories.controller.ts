import { Request, Response } from "express";
import categoryModel from "../../../models/category.model";

export const listCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryModel.find().sort({ createdAt: -1 });
        return res.status(200).json({
            categories,
        });

    } catch (error) {
        console.error("List categories (admin) error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}