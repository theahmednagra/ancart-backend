import { Request, Response } from "express";
import categoryModel from "../../../models/category.model";
import slugify from "slugify";

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(404).json({
                message: "Invalid category data",
            });
        }

        const slug = slugify(name, { lower: true });
        const existingCategory = await categoryModel.findOne({ slug });

        if (existingCategory) {
            return res.status(404).json({
                message: "Category already exists",
            });
        }

        const category = await categoryModel.create({ name, slug });

        return res.status(201).json({
            message: "Category created",
            category,
        });

    } catch (error) {
        console.error("Create category (admin) error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}