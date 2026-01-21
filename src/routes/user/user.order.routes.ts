import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createOrder } from "../../controllers/user/order/createOrder.controller";
import { getUserOrders } from "../../controllers/user/order/getUserOrders.controller";
import { createOrderFromCart } from "../../controllers/user/order/createOrderFromCart.controller";
import { cancelOrder } from "../../controllers/user/order/cancelOrder.controller";
const router = Router();

// Requires authentication
router.use(authMiddleware);

router.post("/", createOrder);
router.get("/", getUserOrders);
router.post("/checkout", createOrderFromCart);
router.patch("/:orderId/cancel", cancelOrder);

export default router;
