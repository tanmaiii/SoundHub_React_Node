import { Router } from "express";
const router = Router();
import songController from "../controllers/song.controller.js";
import songValidation from "../validations/song.validation.js";

router.get(
  "/playlist/:playlistId",
  songValidation.getAllSongByPlaylist,
  songController.getAllSongByPlaylist
);
router.get("/detail/:songId", songValidation.getSong, songController.getSong);
router.post("/like/:songId",songValidation.like, songController.likeSong);
router.delete("/like/:songId",songValidation.unLike, songController.unLikeSong);
router.put("/:songId", songValidation.updateSong, songController.updateSong);
router.post("/", songValidation.createSong, songController.createSong);
router.get("/", songValidation.getAllSong, songController.getAllSong);

export default router;
