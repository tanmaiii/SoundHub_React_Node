import { Router } from "express";
const router = Router();
import uploadImage from "../middlewares/uploadImage.js";
import imageController from "../controllers/image.controller.js";

router.post("/upload", uploadImage, imageController.uploadImage);

export default router;
