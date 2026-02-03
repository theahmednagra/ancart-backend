import { Request, Response } from "express";
import userModel from "../../models/user.model";

export const getMyInfo = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;

        const user = await userModel.findById(userId).select(
            "_id fullname email role status"
        );

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                status: user.status,
            }
        });
    } catch (error) {
        console.error("Get my info error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
