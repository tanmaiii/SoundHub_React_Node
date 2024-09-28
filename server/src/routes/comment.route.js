import { Router } from "express";
const router = Router();
import commentController from "../controllers/comment.controller.js";

router.post("/:songId", commentController.createComment);
router.get("/reply/:commentId", commentController.getAllRelatedComments);
router.get("/:songId", commentController.getAllCommentsBySongId);
router.post("/like/:commentId", commentController.likeComment);
router.delete("/like/:commentId", commentController.unLikeComment);
router.get("/like/:commentId", commentController.countLikeComment);
router.get("/check-like/:commentId", commentController.checkLikeComment);

export default router;
