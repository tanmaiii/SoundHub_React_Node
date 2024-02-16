import { Router } from "express";
const router = Router();
import uploadMp3 from "../middlewares/uploadMp3.js";
import mp3Controller from "../controllers/mp3.controller.js";

router.post("/upload", uploadMp3, mp3Controller.uploadMp3);

export default router;
