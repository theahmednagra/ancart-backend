import { Request, Response, NextFunction } from "express";

export const devAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    (req as any).user = {
        id: "test-user-id",
        email: "test@example.com",
        name: "Test User",
        role: "user",
    };

    next();
};