import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/role.middleware";
import { getAllOrders } from "../../controllers/admin/order/getAllOrders.controller";
import { getOrderById } from "../../controllers/admin/order/getOrderById.controller";
import { updateOrderStatus } from "../../controllers/admin/order/updateOrderStatus.controller";

const router = Router();

router.use(authMiddleware);
router.use(authorizeRoles(["ADMIN"]));

router.get("/", getAllOrders);
router.get("/:orderId", getOrderById);
router.patch("/:orderId/status", updateOrderStatus);

export default router;