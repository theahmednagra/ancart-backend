import { Request, Response } from "express";
import categoryModel from "../../../models/category.model";

export const listPublicCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryModel.find({ isActive: true })
            .select("name slug")
            .sort({ name: -1 });
            
        return res.status(200).json({
            categories,
        });

    } catch (error) {
        console.error("List categories (public) error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}