import { Router } from "express";
const router = Router();
import userController from "../controllers/user.controller.js";
import userValidation from "../validations/user.validation.js";

router.get("/", userValidation.getAllUser, userController.getAllUser);
router.get("/me", userController.getMe);
router.get("/:userId", userValidation.getUser, userController.getUser);
router.post("/follow/:userId",userValidation.addFollow, userController.addFollow);
router.delete("/follow/:userId",userValidation.removeFollow, userController.removeFollow);

export default router;
