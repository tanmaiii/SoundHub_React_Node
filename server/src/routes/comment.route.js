import { Router } from "express";
const router = Router();
import commentController from "../controllers/comment.controller.js";

router.post("/:songId", commentController.createComment);
router.get("/:songId", commentController.getAllComments);
router.post("/like/:commentId", commentController.likeComment);
router.delete("/like/:commentId", commentController.unLikeComment);
router.get("/checkLiked/:commentId", commentController.checkLikeComment);

export default router;
