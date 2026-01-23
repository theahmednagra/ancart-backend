import { Request, Response } from "express";
import categoryModel from "../../../models/category.model";
import productModel from "../../../models/product.model";
import slugify from "slugify";
import { uploadToCloudinary } from "../../../utils/cloudinaryUpload";

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, categoryId, stock } = req.body;
        const image = req.file;

        // 1. Presence check
        if (!name || !description || !image || price === null || !categoryId || stock === null) {
            return res.status(404).json({
                message: "Invalid product data",
            });
        }

        // 2. Price and stock validation
        if (price < 0 || stock < 0) {
            return res.status(404).json({
                message: "Invalid price or stock",
            });
        }

        // 3. Find category
        const category = await categoryModel.findOne({ _id: categoryId, isActive: true });
        if (!category) {
            return res.status(404).json({
                message: "Category not found or inactive",
            });
        }

        // 4. Create slug
        const slug = slugify(name, { lower: true })

        // 5. Check if product already exists
        const existingProduct = await productModel.findOne({ slug });
        if (existingProduct) {
            return res.status(404).json({
                message: "Product with same name already exists",
            });
        }

        // 6. Upload image to cloudinary
        const uploadResult = await uploadToCloudinary(image.buffer, "products")

        // 7. Create product
        const product = await productModel.create({
            name,
            slug,
            description,
            image: uploadResult.secure_url,
            price,
            category: category._id,
            stock,
        });

        return res.status(201).json({
            message: "Product created successfully",
            product,
        });

    } catch (error) {
        console.error("Create product error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}