import { Request, Response } from "express";
import userModel from "../../models/user.model";
import bcrypt from "bcryptjs";

export const signinController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 1. Presence check
        if (!email.trim() || !password.trim()) {
            return res.status(400).json({
                message: "Invalid signin data"
            })
        }

        const normalizedEmail = email.toLowerCase();

        // 2. Find user
        const user = await userModel.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // 3. Block unverified users
        if (user?.status === "UNVERIFIED") {
            return res.status(403).json({
                message: "Please verify your account before signin",
            });
        }

        // 4. Compare password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // 5. Success (token later)
        return res.status(200).json({
            message: "Signin successful",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Signin error: ", error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}