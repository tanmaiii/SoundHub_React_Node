import { Router } from "express";
const router = Router();
import commentController from "../controllers/comment.controller.js";
import commentValidation from "../validations/comment.validation.js";
import validate from "../middlewares/validate.js";

// Tạo comment
router.post(
  "/:songId",
  validate(commentValidation.createComment),
  commentController.createComment
);
//Xóa comment
router.delete(
  "/:commentId",
  validate(commentValidation.deleteComment),
  commentController.deleteComment
);
// Trả lời comment
router.get("/reply/:commentId", commentController.getAllRelatedComments);

router.get(
  "/:songId",
  validate(commentValidation.getAllCommentsBySongId),
  commentController.getAllCommentsBySongId
);
router.post(
  "/like/:commentId",
  validate(commentValidation.likeComment),
  commentController.likeComment
);
router.delete(
  "/like/:commentId",
  validate(commentValidation.unLikeComment),
  commentController.unLikeComment
);
router.get("/like/:commentId", commentController.countLikeComment);
router.get("/check-like/:commentId", commentController.checkLikeComment);

export default router;
