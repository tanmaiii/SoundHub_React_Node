import { Router } from "express";
const router = Router();
import playlistController from "../controllers/playlist.controller.js";
import playlistValidation from "../validations/playlist.validation.js";

router.get("/:playlistId", playlistValidation.getPlaylist, playlistController.getPlaylist);
router.get("/user/:userId", playlistController.getPlaylistByUser);
router.get("/");

export default router;
