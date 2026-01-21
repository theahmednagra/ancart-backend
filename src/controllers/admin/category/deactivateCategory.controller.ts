import { Request, Response } from "express";
import categoryModel from "../../../models/category.model";

export const deactivateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const category = await categoryModel.findById(id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
            });
        }

        category.isActive = false;
        await category.save();

        return res.status(200).json({
            message: "Category deactivated",
        });

    } catch (error) {
        console.error("Deactivate category (admin) error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}