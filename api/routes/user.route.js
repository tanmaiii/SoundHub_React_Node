import { Router } from "express";
const router = Router();
import userController from "../controllers/user.controller.js";
import userValidation from "../validations/auth.validation.js";

router.get("/:userId", userValidation.getUser, userController.getUser);
router.get("/", userController.getAllUser);

export default router;
