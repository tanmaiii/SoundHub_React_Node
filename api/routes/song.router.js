import { Router } from "express";
const router = Router();
import songController from "../controllers/song.controller.js";
// import userValidation from "../validations/auth.validation.js";

router.get("/:songId", songController.getSong);
router.get("/");

export default router;
