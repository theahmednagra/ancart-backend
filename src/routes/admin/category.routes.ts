import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/role.middleware";
import { upload } from "../../middlewares/upload.middleware";
import { createCategory } from "../../controllers/admin/category/createCategory.controller";
import { updateCategory } from "../../controllers/admin/category/updateCategory.controller";
import { deactivateCategory } from "../../controllers/admin/category/deactivateCategory.controller";
import { listCategories } from "../../controllers/admin/category/listCategories.controller";
import { getCategoryById } from "../../controllers/admin/category/getCategoryById.controller";

const router = Router();

router.use(authMiddleware);
router.use(authorizeRoles(["ADMIN"]));

router.get("/get-all-categories", listCategories); // done
router.get("/get-category-by-id/:categoryId", getCategoryById);
router.post("/create-category", upload.single("image"), createCategory); // done
router.patch("/update-category/:categoryId", upload.single("image"), updateCategory); // done
router.patch("/deactivate-category/:categoryId", deactivateCategory); // done

export default router;