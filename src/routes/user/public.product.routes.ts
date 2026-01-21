import { Router } from "express";
import { listPublicProducts } from "../../controllers/user/product/listPublicProducts.controller";

const router = Router();

router.get("/", listPublicProducts); // done

export default router;