import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createPaymentController } from "../../controllers/user/payment/createPayment.controller";
import { handleSafepayWebhook } from "../../controllers/user/payment/safepayWebhook.controller";

const router = Router();

router.post("/create/:orderId", authMiddleware, createPaymentController);
router.post("/webhook/safepay", handleSafepayWebhook);

export default router;