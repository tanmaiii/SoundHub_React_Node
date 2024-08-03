import { Router } from "express";
const router = Router();

import userSongController from "../controllers/userSong.controller.js";
import userSongValodation from "..//validations/userSong.validation.js";
import validate from "../middlewares/validate.js";

router.get(
  "/:songId/me",
  //   validate(userSongValodation.getAllUserConfirm),
  userSongController.getAllUser
);

router.get("/:songId/check", userSongController.checkUserConfirm);

router.get(
  "/:songId",
  validate(userSongValodation.getAllUserConfirm),
  userSongController.getAllUserConfirm
);

router.post(
  "/",
  //   validate(userSongValodation.createUserSong),
  userSongController.createUserSong
);

export default router;
