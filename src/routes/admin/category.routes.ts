import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/role.middleware";
import { createCategory } from "../../controllers/admin/category/createCategory.controller";
import { updateCategory } from "../../controllers/admin/category/updateCategory.controller";
import { deactivateCategory } from "../../controllers/admin/category/deactivateCategory.controller";
import { listCategories } from "../../controllers/admin/category/listCategories.controller";

const router = Router();

// router.use(authMiddleware);
// router.use(authorizeRoles(["ADMIN"]));

router.get("/", listCategories); // // done
router.post("/", createCategory); // // done
router.patch("/:id", updateCategory); // // done
router.patch("/:id/deactivate", deactivateCategory); // // done

export default router;