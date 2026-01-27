import { Request, Response } from "express";
import categoryModel from "../../../models/category.model";

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const { categoryId } = req.params;

        const category = await categoryModel.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
            })
        }

        return res.status(200).json({
            success: true,
            category,
        });

    } catch (error) {
        console.error("Get category (admin) error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}