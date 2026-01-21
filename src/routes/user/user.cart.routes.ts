import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { addToCart } from "../../controllers/user/cart/addToCart.controller";
import { getCart } from "../../controllers/user/cart/getCart.controller";
import { clearCart } from "../../controllers/user/cart/clearCart.controller";
import { removeFromCart } from "../../controllers/user/cart/removeFromCart.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", getCart);
router.post("/add", addToCart);
router.delete("/remove/:productId", removeFromCart);
router.post("/clear-cart", clearCart);

export default router;