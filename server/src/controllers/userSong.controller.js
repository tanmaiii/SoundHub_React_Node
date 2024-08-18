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

    Song.findById(req.query.songId, userInfo.id, (err, song) => {
      if (err) {
        return res.status(401).json({ conflictError: err });
      }
      if (!song) {
        return res.status(404).json({ conflictError: "Không tìm thấy !" });
      }
      UserSong.find(req.query.userId, req.query.songId, (err, data) => {
        if (err || !data) {
          return res.status(401).json({ conflictError: "Không tìm thấy !" });
        }

        if (userInfo.id === song.user_id || userInfo.id === data.user_id) {
          return res.json(data);
        }

        return res.status(400).json({ conflictError: "Không có quyền !" });
      });
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

//Lấy tất cả bài hát mà người dùng đã tham gia

//Lấy tất cả các yêu cầu cuả người dùng
export const getAllSongByMe = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const userInfo = await jwtService.verifyToken(token);

    UserSong.findAllSong(userInfo.id, req.query, (err, data) => {
      if (err) {
        return res.status(401).json({ conflictError: err });
      } else {
        return res.json(data);
      }
    });
  } catch (error) {
    return res.status(400).json(error);
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

        if (data && data?.status === "Rejected") {
          UserSong.delete(req.body.userId, req.body.songId, (err, data) => {
            if (err) {
              return res.status(401).json({ conflictError: err });
            }
          });
        }

        if (data && data?.status === "Accepted") {
          return res
            .status(401)
            .json({ conflictError: "Người dùng đã chấp nhận lời mời !" });
        }

        if (data && data?.status === "Pending") {
          return res
            .status(401)
            .json({ conflictError: "Lời mời đã được gửi từ trước !" });
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

    Song.findById(req.params.songId, userInfo.id, (err, song) => {
      if (err) {
        return res.status(401).json({ conflictError: err });
      }
      if (!song) {
        return res.status(404).json({ conflictError: "Không tìm thấy !" });
      }

      //Kiểm tra xem user đã được thêm vào bài hát chưa
      UserSong.find(userInfo.id, req.params.songId, (err, data) => {
        if (err) {
          return res.status(401).json({ conflictError: err });
        }
        if (!data) {
          return res
            .status(401)
            .json({ conflictError: "Người dùng chưa tham gia" });
        }

        //Kiểm tra xem user đã xác nhận tham gia vào bài hát chưa
        if (data.status === "Accepted") {
          return res
            .status(401)
            .json({ conflictError: "Người dùng đã xác nhận" });
        }

        //Kiểm tra xem user có phải là chính mình không
        if (data.user_id !== userInfo.id) {
          return res
            .status(401)
            .json({ conflictError: "Không thể xác nhận chính mình" });
        }

        //Xác nhận tham gia vào bài hát
        UserSong.confirm(userInfo.id, req.params.songId, (err, data) => {
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

//Hủy xác nhận tham gia vào bài hát
export const unConfirmUserSong = async (req, res) => {
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

      //Kiểm tra xem user đã được thêm vào bài hát chưa
      UserSong.find(userInfo.id, req.params.songId, (err, data) => {
        if (err) {
          return res.status(401).json({ conflictError: err });
        }
        if (!data) {
          return res
            .status(401)
            .json({ conflictError: "Người dùng chưa tham gia" });
        }

        //Kiểm tra xem user đã xác nhận tham gia vào bài hát chưa
        if (data.status === "Rejected") {
          return res
            .status(401)
            .json({ conflictError: "Người dùng đã từ chối" });
        }

        //Kiểm tra xem user có phải là chính mình không
        if (data.user_id !== userInfo.id) {
          return res
            .status(401)
            .json({ conflictError: "Không thể xác nhận chính mình" });
        }

        //Xác nhận tham gia vào bài hát
        UserSong.unConfirm(userInfo.id, req.params.songId, (err, data) => {
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

//Xóa người dùng khỏi bài hát
export const deleteUserSong = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const userInfo = await jwtService.verifyToken(token);

    Song.findById(req.query.songId, userInfo.id, (err, song) => {
      if (err) {
        return res.status(401).json({ conflictError: err });
      }
      if (!song) {
        return res.status(404).json({ conflictError: "Không tìm thấy !" });
      }

      console.log(req.query);

      //Kiểm tra xem user đã được thêm vào bài hát chưa
      UserSong.find(req.query.userId, req.query.songId, (err, data) => {
        if (err) {
          return res.status(401).json({ conflictError: err });
        }
        if (!data) {
          return res
            .status(401)
            .json({ conflictError: "Người dùng chưa tham gia" });
        }

        if (data.user_id !== userInfo.id && song.user_id !== userInfo.id) {
          return res.status(401).json({ conflictError: "Không có quyền !" });
        }

        //Xác nhận tham gia vào bài hát
        UserSong.delete(req.query.userId, req.query.songId, (err, data) => {
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
  getAllSongByMe,
  checkUserConfirm,
  createUserSong,
  confirmUserSong,
  unConfirmUserSong,
  deleteUserSong,
};
