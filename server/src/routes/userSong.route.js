import { Router } from "express";
const router = Router();

import userSongController from "../controllers/userSong.controller.js";
import userSongValodation from "../validations/userSong.validation.js";
import validate from "../middlewares/validate.js";

//Lấy tất cả các yêu cầu
router.get(
  "/me",
  validate(userSongValodation.getAllSongByMe),
  userSongController.getAllSongByMe
);

//Kiem tra xem nguoi dung da xac nhan tham gia vao bai hat chua
router.get(
  "/detail",
  validate(userSongValodation.checkUserConfirm),
  userSongController.checkUserConfirm
);

//Lay tat ca nguoi dung da them vao bai hat (bao gom ca nguoi dung chua xac nhan)
router.get(
  "/:songId/me",
  //   validate(userSongValodation.getAllUserConfirm),
  userSongController.getAllUser
);

//Lay tat ca nguoi dung da xac nhan tham gia vao bai hat
router.get(
  "/:songId",
  validate(userSongValodation.getAllUserConfirm),
  userSongController.getAllUserConfirm
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
  //   validate(userSongValodation.unConfirmUserSong),
  userSongController.deleteUserSong
);

//Xac nhan tham gia vao bai hat
router.put(
  "/:songId/confirm",
  //   validate(userSongValodation.confirmUserSong),
  userSongController.confirmUserSong
);

//Huy xac nhan tham gia vao bai hat
router.delete(
  "/:songId/confirm",
  //   validate(userSongValodation.confirmUserSong),
  userSongController.unConfirmUserSong
);

export default router;
