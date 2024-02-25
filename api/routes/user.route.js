import { Router } from "express";
const router = Router();
import userController from "../controllers/user.controller.js";
import userValidation from "../validations/user.validation.js";

router.get("/", userController.getAllUser);
router.get("/owner", userController.getOwnerUser);
router.get("/:userId", userValidation.getUser, userController.getUser);

export default router;
