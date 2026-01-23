import { Request, Response } from "express";
import categoryModel from "../../../models/category.model";
import { Types } from "mongoose";
import slugify from "slugify";
import { uploadToCloudinary } from "../../../utils/cloudinaryUpload";

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { categoryId } = req.params;
        const { name, isActive } = req.body;
        const image = req.file;

        // 1. Find category
        const category = await categoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                message: "Category not found",
            });
        }

        // 2. Set name and slug
        if (typeof name === "string" && name.trim()) {
            const newSlug = slugify(name, { lower: true });

            const existingSlug = await categoryModel.findOne({
                slug: newSlug,
                _id: { $ne: new Types.ObjectId(categoryId as string) }
            });

            if (existingSlug) {
                return res.status(409).json({
                    message: "Category name already in use",
                });
            }

            category.name = name;
            category.slug = newSlug;
        }

        // 3. Set image
        if (image) {
            const uploadResult = await uploadToCloudinary(image.buffer, "categories");
            category.image = uploadResult.secure_url;
        }

        // 4. Set isActive
        if (typeof isActive === "boolean") {
            category.isActive = isActive;
        }

        await category.save();

        return res.status(200).json({
            message: "Category updated successfully",
            category,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to update category"
        });
    }
};
