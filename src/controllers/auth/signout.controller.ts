import { Request, Response } from "express";

export const signoutController = async (req: Request, res: Response) => {
    return res
        .clearCookie("accessToken", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        })
        .status(200)
        .json({
            message: "Signed out successfully",
        });
};
