import Song from "../model/song.model.js";
import jwt from "jsonwebtoken";

export const getSong = (req, res) => {
  try {
    const token = req.cookies.accessToken;

    jwt.verify(token, process.env.MY_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ conflictError: "Token không hợp lệ !" });
      }
      Song.findById(req.params.songId, user.id, (err, song) => {
        if (err) {
          return res.status(401).json({ conflictError: err });
        } else {
          return res.json(song);
        }
      });
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getAllSong = (req, res) => {
  try {
    Song.getAll(req.query, (err, data) => {
      if (!data) {
        return res.status(401).json("Không tìm thấy");
      } else {
        return res.json(data);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getAllSongByPlaylist = (req, res) => {
  try {
    Song.findByPlaylistId(req.params.playlistId, req.query, (err, data) => {
      if (!data) {
        return res.status(401).json("Không tìm thấy");
      } else {
        return res.json(data);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getAllSongByUser = (req, res) => {
  try {
    Song.findByUserId(req.params.userId, req.query, (err, data) => {
      if (!data) {
        return res.status(401).json("Không tìm thấy");
      } else {
        return res.json(data);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getAllFavoritesByUser = (req, res) => {
  try {
    const token = req.cookies.accessToken;
    jwt.verify(token, process.env.MY_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ conflictError: "Token không hợp lệ !" });
      }
      Song.findByFavorite(user.id, req.query, (err, data) => {
        if (!data) {
          return res.status(401).json("Không tìm thấy");
        } else {
          return res.json(data);
        }
      });
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const createSong = (req, res) => {
  try {
    const token = req.cookies.accessToken;
    jwt.verify(token, process.env.MY_SECRET, (err, user) => {
      if (err) {
        const conflictError = "Token không hợp lệ !";
        return res.status(401).json({ conflictError });
      }
      Song.create(user.id, req.body, (err, data) => {
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

export const updateSong = (req, res) => {
  try {
    const token = req.cookies.accessToken;
    jwt.verify(token, process.env.MY_SECRET, (err, user) => {
      if (err) {
        const conflictError = "Token không hợp lệ !";
        return res.status(401).json({ conflictError });
      }
      Song.update(req.params.songId, user.id, req.body, (err, data) => {
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

export const likeSong = (req, res) => {
  try {
    const token = req.cookies.accessToken;

    jwt.verify(token, process.env.MY_SECRET, (err, user) => {
      if (err) {
        const conflictError = "Token không hợp lệ !";
        return res.status(401).json({ conflictError });
      }
      Song.like(req.params.songId, user.id, (err, data) => {
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

export const unLikeSong = (req, res) => {
  try {
    const token = req.cookies.accessToken;

    jwt.verify(token, process.env.MY_SECRET, (err, user) => {
      if (err) {
        const conflictError = "Token không hợp lệ !";
        return res.status(401).json({ conflictError });
      }
      Song.unlike(req.params.songId, user.id, (err, data) => {
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
  getSong,
  getAllSong,
  getAllSongByPlaylist,
  getAllSongByUser,
  getAllFavoritesByUser,
  createSong,
  updateSong,
  likeSong,
  unLikeSong,
};
