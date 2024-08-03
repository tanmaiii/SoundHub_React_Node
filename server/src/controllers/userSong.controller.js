import User from "../model/user.model.js";
import UserSong from "../model/userSong.model.js";
import jwtService from "../services/jwtService.js";
import Song from "../model/song.model.js";

//Lấy tất cả user
export const getAllUser = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const userInfo = await jwtService.verifyToken(token);

    Song.findById(req.params.songId, userInfo.id, (err, song) => {
      if (err) {
        return res.status(401).json({ conflictError: err });
      }
      if (!song) {
        return res.status(404).json({ conflictError: "Không tìm thấy !" });
      }
      if (song.user_id !== userInfo.id) {
        return res.status(401).json({ conflictError: "Không có quyền xem" });
      }

      UserSong.findAllUser(req.params.songId, userInfo.id, (err, data) => {
        if (err) {
          return res.status(401).json({ conflictError: err });
        } else {
          return res.json(data);
        }
      });
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

//Lấy tất cả user đã xác nhận tham gia vào bài hát
export const getAllUserConfirm = async (req, res) => {
  try {
    UserSong.findAllUserConfirm(req.params.songId, (err, data) => {
      if (err) {
        return res.status(401).json({ conflictError: err });
      } else {
        return res.json(data);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

//Kiểm tra xem user đã xác nhận tham gia vào bài hát chưa
export const checkUserConfirm = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const userInfo = await jwtService.verifyToken(token);

    UserSong.find(req.body.userId, req.body.songId, (err, data) => {
      if (err) {
        return res.status(401).json({ conflictError: err });
      } else {
        return res.json(data);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

//Tạo user_song
export const createUserSong = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const userInfo = await jwtService.verifyToken(token);

    Song.findById(req.body.songId, userInfo.id, (err, song) => {
      if (err) {
        return res.status(401).json({ conflictError: err });
      }
      if (!song) {
        return res.status(404).json({ conflictError: "Không tìm thấy !" });
      }
      if (song.user_id !== userInfo.id) {
        return res.status(401).json({ conflictError: "Không có quyền !" });
      }

      //Kiểm tra xem user đã được thêm vào bài hát chưa
      UserSong.find(req.body.userId, req.body.songId, (err, data) => {
        if (err) {
          return res.status(401).json({ conflictError: err });
        }
        if (data) {
          return res
            .status(401)
            .json({ conflictError: "Người dùng đã tham gia" });
        }

        //Tạo user_song
        UserSong.create(req.body.userId, req.body.songId, (err, data) => {
          if (err) {
            return res.status(401).json({ conflictError: err });
          } else {
            return res.json(data);
          }
        });
      });
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

//Xác nhận tham gia vào bài hát
export const confirmUserSong = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const userInfo = await jwtService.verifyToken(token);

    Song.findById(req.body.songId, userInfo.id, (err, song) => {
      if (err) {
        return res.status(401).json({ conflictError: err });
      }
      if (!song) {
        return res.status(404).json({ conflictError: "Không tìm thấy !" });
      }
      if (song.user_id !== userInfo.id) {
        return res.status(401).json({ conflictError: "Không có quyền !" });
      }

      //Kiểm tra xem user đã được thêm vào bài hát chưa
      UserSong.find(req.body.userId, req.body.songId, (err, data) => {
        if (err) {
          return res.status(401).json({ conflictError: err });
        }
        if (!data) {
          return res
            .status(401)
            .json({ conflictError: "Người dùng chưa tham gia" });
        }

        //Xác nhận user_song
        UserSong.confirm(req.body.userId, req.body.songId, (err, data) => {
          if (err) {
            return res.status(401).json({ conflictError: err });
          } else {
            return res.json(data);
          }
        });
      });
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export default {
  getAllUserConfirm,
  getAllUser,
  checkUserConfirm,
  createUserSong,
};
