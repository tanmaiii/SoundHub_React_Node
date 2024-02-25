import { Router } from "express";
const router = Router();
import imageRoute from "./image.route.js";
import mp3Route from "./mp3.route.js";

import authRoute from "./auth.route.js";
import userRoute from "./user.route.js";
import songRoute from "./song.router.js";
import playlistRoute from "./playlist.router.js";

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/song", songRoute);
router.use("/playlist", playlistRoute);

router.use("/image", imageRoute);
router.use("/mp3", mp3Route);

export default router;
