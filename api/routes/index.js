import { Router } from "express";
const router = Router();

import authRoute from "./auth.route.js";
import userRoute from "./user.route.js";
import imageRoute from "./image.route.js";
import mp3Route from "./mp3.route.js";
import songRoute from "./song.router.js";

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/song", songRoute);

router.use("/image", imageRoute);
router.use("/mp3", mp3Route);

export default router;
