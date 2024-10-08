import { Router } from "express";
const router = Router();
import imageRoute from "./image.route.js";
import mp3Route from "./mp3.route.js";

import authRoute from "./auth.route.js";
import userRoute from "./user.route.js";
import songRoute from "./song.router.js";
import playlistRoute from "./playlist.router.js";
import genreRoute from "./genre.route.js";
import followRoute from "./follow.route.js";
import songPlayRoute from "./songPlay.route.js";
import userSongRoute from "./userSong.route.js";
import favouriteRoute from "./favourite.route.js";
import searchRoute from "./search.route.js";
import lyricRoute from "./lyric.route.js";
import commentRoute from "./comment.route.js";

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/song", songRoute);
router.use("/playlist", playlistRoute);
router.use("/genre", genreRoute);
router.use("/follow", followRoute);
router.use("/songPlay", songPlayRoute);
router.use("/userSong", userSongRoute);
router.use("/favourite", favouriteRoute);
router.use("/search", searchRoute);
router.use("/comment", commentRoute);

router.use("/image", imageRoute);
router.use("/mp3", mp3Route);
router.use("/lyric", lyricRoute);

export default router;
