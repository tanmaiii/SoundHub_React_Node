import { Router } from "express";
const router = Router();
import commentController from "../controllers/comment.controller.js";

router.get("/:songId", commentController.createComment);

export default router;
