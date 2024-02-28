import { Router } from "express";
const router = Router();
import userController from "../controllers/user.controller.js";
import userValidation from "../validations/user.validation.js";

router.get("/", userValidation.getAllUser ,userController.getAllUser);
router.get("/me", userController.getMe);
router.get("/:userId", userValidation.getUser, userController.getUser);

export default router;
