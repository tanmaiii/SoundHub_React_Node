import { Router } from "express";
const router = Router();
import playlistController from "../controllers/playlist.controller.js";
import playlistValidation from "../validations/playlist.validation.js";

router.get("/detail/:playlistId", playlistValidation.getPlaylist, playlistController.getPlaylist);
router.get(
  "/user/:userId",
  playlistValidation.getAllPlaylistByUser,
  playlistController.getAllPlaylistByUser
);
router.get("/me", playlistValidation.getAllPlaylistByMe, playlistController.getAllPlaylistByMe);
router.get("/", playlistValidation.getAllPlaylist, playlistController.getAllPlaylist);
router.post("/", playlistValidation.createPlaylist, playlistController.createPlaylist);
router.put("/:userId", playlistValidation.createPlaylist, playlistController.updatePlaylist);

router.post("/like/:playlistId", playlistValidation.like, playlistController.likePlaylist);
router.delete("/like/:playlistId", playlistValidation.unLike, playlistController.unLikePlaylist);

router.post("/song", playlistValidation.addSong, playlistController.addSongPlaylist);
router.delete("/song", playlistValidation.unAddSong, playlistController.unAddSongPlaylist);

export default router;
