import { Router } from "express";
const router = Router();
import playlistController from "../controllers/playlist.controller.js";
import playlistValidation from "../validations/playlist.validation.js";

router.get("/detail/:playlistId", playlistValidation.getPlaylist, playlistController.getPlaylist);
router.get(
  "/user/:userId",
  playlistValidation.getAllPlaylist,
  playlistController.getPlaylistByUser
);
router.post("/", playlistValidation.createPlaylist, playlistController.createPlaylist);
router.post("/like/:playlistId", playlistController.likePlaylist);
router.delete("/like/:playlistId", playlistController.unLikePlaylist);
router.put("/:userId", playlistValidation.createPlaylist, playlistController.updatePlaylist);

export default router;
