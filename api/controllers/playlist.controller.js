import Playlist from "../model/playlist.model.js";
import jwt from "jsonwebtoken";

export const getPlaylist = (req, res) => {
  try {
    Playlist.findById(req.params.playlistId, (err, playlist) => {
      if (!playlist) {
        return res.status(401).json("Không tìm thấy 123");
      } else {
        return res.json(playlist);
      }
    });
  } catch (error) {
    res.status(401).json(error);
  }
};

export const getPlaylistByUser = (req, res) => {
  try {
    Playlist.findByUserId(req, (err, playlist) => {
      if (!playlist) {
        return res.status(401).json("Không tìm thấy");
      } else {
        return res.json(playlist);
      }
    });
  } catch (error) {
    res.status(401).json(error);
  }
};

export const createPlaylist = (req, res) => {
  try {
    Playlist.create(req.body, (err, data) => {
      if (err) {
        const conflictError = "Tạo playlist không thành công !";
        return res.status(401).json({ conflictError });
      } else {
        return res.json(data);
      }
    });
  } catch (error) {
    res.status(401).json(error);
  }
};

export const updatePlaylist = (req, res) => {
  try {
    Playlist.update(req.params.userId, req.body, (err, data) => {
      if (err) {
        const conflictError = "Tạo playlist không thành công !";
        return res.status(401).json({ conflictError });
      } else {
        return res.json(data);
      }
    });
  } catch (error) {
    res.status(401).json(error);
  }
};

export const likePlaylist = (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      const conflictError = "Không tìm thấy token !";
      return res.status(401).json({ conflictError });
    }
    
    jwt.verify(token, process.env.MY_SECRET, (err, user) => {
      console.log(req.params.playlistId, user.id);
      if (err) {
        const conflictError = "Token không hợp lệ !";
        return res.status(401).json({ conflictError });
      }
      Playlist.like(req.params.playlistId, user.id, (err, data) => {
        if (err) {
          const conflictError = "Lỗi !";
          return res.status(401).json({ conflictError });
        } else {
          return res.json(data);
        }
      });
    });

  } catch (error) {
    res.status(401).json(error);
  }
};

export const unLikePlaylist = (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      const conflictError = "Không tìm thấy token !";
      return res.status(401).json({ conflictError });
    }

    jwt.verify(token, process.env.MY_SECRET, (err, user) => {
      if (err) {
        const conflictError = "Token không hợp lệ !";
        return res.status(401).json({ conflictError });
      }
      Playlist.unlike(req.params.playlistId, user.id, (err, data) => {
        if (err) {
          const conflictError = "Lỗi !";
          return res.status(401).json({ conflictError });
        } else {
          return res.json(data);
        }
      });
    });

  } catch (error) {
    res.status(401).json(error);
  }
};

export default {
  getPlaylist,
  getPlaylistByUser,
  createPlaylist,
  updatePlaylist,
  likePlaylist,
  unLikePlaylist
};
