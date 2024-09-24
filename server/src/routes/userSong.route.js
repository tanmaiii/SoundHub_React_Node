import { Router } from "express";
const router = Router();

import userSongController from "../controllers/userSong.controller.js";
import userSongValodation from "../validations/userSong.validation.js";
import validate from "../middlewares/validate.js";

//Lấy tất cả các yêu cầu gửi
router.get(
  "/me",
  validate(userSongValodation.getAllSongByMe),
  userSongController.getAllSongByMe
);

router.get(
  "/:songId/accepted",
  validate(userSongValodation.getAllUser),
  userSongController.getAllUserAccepted
);

//Kiem tra xem nguoi dung da xac nhan tham gia vao bai hat chua
router.get(
  "/detail",
  validate(userSongValodation.checkUserConfirm),
  userSongController.checkUserConfirm
);

//Lay tat ca nguoi dung da them vao bai hat (bao gom ca nguoi dung chua xac nhan)
router.get(
  "/:songId/all",
  validate(userSongValodation.getAllUser),
  userSongController.getAllUser
);

//Them nguoi dung khoi bai hat
router.post(
  "/",
  validate(userSongValodation.createUserSong),
  userSongController.createUserSong
);

//Xoa nguoi dung khoi bai hat
router.delete(
  "/",
  validate(userSongValodation.deleteUserSong),
  userSongController.deleteUserSong
);

//Xac nhan tham gia vao bai hat
router.put(
  "/:songId/confirm",
  validate(userSongValodation.confirmUserSong),
  userSongController.confirmUserSong
);

//Huy xac nhan tham gia vao bai hat
router.delete(
  "/:songId/confirm",
  validate(userSongValodation.unConfirmUserSong),
  userSongController.unConfirmUserSong
);

export default router;
