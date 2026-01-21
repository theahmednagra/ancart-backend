import { Router } from "express";
import { signupController } from "../../controllers/auth/signup.controller";
import { signinController } from "../../controllers/auth/signin.controller";
import { resendVerification } from "../../controllers/auth/resendVerification.controller";
import { verifyEmail } from "../../controllers/auth/verifyEmail.controller";

const router = Router();

router.post("/signup", signupController); // done
router.post("/verification", verifyEmail); // done
router.post("/resend-verification", resendVerification); // done
router.post("/signin", signinController); // done

export default router;