import { Router } from "express";
const router = Router();
import uploadLyric from "../middlewares/uploadLyric.js";
import lyricController from "../controllers/lyric.controller.js";

router.post("/", uploadLyric, lyricController.uploadLyric);
router.delete("/", lyricController.deleteLyric);
router.get("/:songId", lyricController.getLyric);

export default router;
