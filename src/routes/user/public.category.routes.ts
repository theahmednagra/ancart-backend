import { Router } from "express";
import { listPublicCategories } from "../../controllers/user/category/listPublicCategories.controller";

const router = Router();

router.get("/", listPublicCategories); // done

export default router;