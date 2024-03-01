import Playlist from "../model/playlist.model.js";
import jwt from "jsonwebtoken";

export const getPlaylist = (req, res) => {
  try {
    Playlist.findById(req.params.playlistId, (err, playlist) => {
      if (!playlist) {
        return res.status(401).json("Không tìm thấy !");
      } else {
        return res.json(playlist);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getAllPlaylist = (req, res) => {
  try {
    Playlist.getAll(req.query, (err, playlist) => {
      if (!playlist) {
        return res.status(401).json("Không tìm thấy");
      } else {
        return res.json(playlist);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getAllPlaylistByMe = (req, res) => {
  const token = req.cookies.accessToken;

  jwt.verify(token, process.env.MY_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ conflictError: "Token không hợp lệ !" });
    }
    Playlist.getMe(user.id, req.query, (err, data) => {
      if (err) {
        const conflictError = err;
        return res.status(401).json({ conflictError });
      } else {
        return res.json(data);
      }
    });
  });
};

export const getAllPlaylistByUser = (req, res) => {
  try {
    Playlist.findByUserId(req.params.userId, req.query, (err, playlist) => {
      if (!playlist) {
        return res.status(401).json("Không tìm thấy");
      } else {
        return res.json(playlist);
      }
    });
  } catch (error) {
    res.status(400).json(error);
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
    res.status(400).json(error);
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
    res.status(400).json(error);
  }
};

export const likePlaylist = (req, res) => {
  try {
    const token = req.cookies.accessToken;

    jwt.verify(token, process.env.MY_SECRET, (err, user) => {
      if (err) {
        const conflictError = "Token không hợp lệ !";
        return res.status(401).json({ conflictError });
      }
      Playlist.like(req.params.playlistId, user.id, (err, data) => {
        if (err) {
          const conflictError = err;
          return res.status(401).json({ conflictError });
        } else {
          return res.json(data);
        }
      });
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const unLikePlaylist = (req, res) => {
  try {
    const token = req.cookies.accessToken;

    jwt.verify(token, process.env.MY_SECRET, (err, user) => {
      if (err) {
        const conflictError = "Token không hợp lệ !";
        return res.status(401).json({ conflictError });
      }
      Playlist.unlike(req.params.playlistId, user.id, (err, data) => {
        if (err) {
          const conflictError = err;
          return res.status(401).json({ conflictError });
        } else {
          return res.json(data);
        }
      });
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const addSongPlaylist = (req, res) => {
  try {
    const token = req.cookies.accessToken;

    jwt.verify(token, process.env.MY_SECRET, (err, user) => {
      if (err) {
        const conflictError = "Token không hợp lệ !";
        return res.status(401).json({ conflictError });
      }
      Playlist.addSong(req.body.playlist_id, req.body.song_id, user.id, (err, data) => {
        if (err) {
          const conflictError = err;
          return res.status(401).json({ conflictError });
        } else {
          return res.json(data);
        }
      });
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const unAddSongPlaylist = (req, res) => {
  try {
    const token = req.cookies.accessToken;

    jwt.verify(token, process.env.MY_SECRET, (err, user) => {
      if (err) {
        const conflictError = "Token không hợp lệ !";
        return res.status(401).json({ conflictError });
      }
      Playlist.unAddSong(req.body.playlist_id, req.body.song_id, user.id, (err, data) => {
        if (err) {
          const conflictError = err;
          return res.status(401).json({ conflictError });
        } else {
          return res.json(data);
        }
      });
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export default {
  getPlaylist,
  getAllPlaylist,
  getAllPlaylistByMe,
  getAllPlaylistByUser,
  createPlaylist,
  updatePlaylist,
  likePlaylist,
  unLikePlaylist,
  addSongPlaylist,
  unAddSongPlaylist,
};
