import { Router } from "express";
const router = Router();
import authController from "../controllers/auth.controller.js";
import authValidation from "../validations/auth.validation.js";

router.post("/signin", authValidation.signin, authController.signin);
router.post("/signup", authValidation.signup, authController.signup);

export default router;
