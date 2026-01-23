import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/role.middleware";
import { upload } from "../../middlewares/upload.middleware";
import { createProduct } from "../../controllers/admin/product/createProduct.controller";
import { listProducts } from "../../controllers/admin/product/listProducts.controller";
import { updateProduct } from "../../controllers/admin/product/updateProduct.controller";
import { deactivateProduct } from "../../controllers/admin/product/deactivateProduct.controller";

const router = Router();

router.use(authMiddleware);
router.use(authorizeRoles(["ADMIN"]));

router.get("/get-all-products", listProducts); // done
router.post("/create-product", upload.single("image"), createProduct);
router.patch("/update-product/:productId", upload.single("image"), updateProduct);
router.patch("/deactivate-product/:productId", deactivateProduct); // done

export default router;