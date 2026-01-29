import { Router } from "express";
import { signupController } from "../../controllers/auth/signup.controller";
import { signinController } from "../../controllers/auth/signin.controller";
import { getMyInfo } from "../../controllers/auth/getMyInfo.controller";
import { signoutController } from "../../controllers/auth/signout.controller";
import { resendVerification } from "../../controllers/auth/resendVerification.controller";
import { verifyEmail } from "../../controllers/auth/verifyEmail.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/signup", signupController); // done
router.post("/verification", verifyEmail); // done
router.post("/resend-verification", resendVerification); // done
router.post("/signin", signinController); // done
router.get("/me", authMiddleware, getMyInfo);
router.get("/signout", authMiddleware, signoutController);

export default router;