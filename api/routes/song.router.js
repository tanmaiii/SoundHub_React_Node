import { Router } from "express";
const router = Router();
import songController from "../controllers/song.controller.js";
import songValidation from "../validations/song.validation.js";

router.get("/:songId", songValidation.getSong, songController.getSong);
router.get("/", songValidation.getAllSong, songController.getAllSong);

export default router;
