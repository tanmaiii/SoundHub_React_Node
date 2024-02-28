import Song from "../model/song.model.js";
import jwt from "jsonwebtoken";

export const getSong = (req, res) => {
  try {
    Song.findById(req.params.songId, (err, song) => {
      if (!song) {
        return res.status(401).json("Không tìm thấy");
      } else {
        return res.json(song);
      }
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
    Song.findByPlaylistId(req, (err, data) => {
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

export const createSong = (req, res) => {
  try {
    Song.create(req.body, (err, data) => {
      if (err) {
        const conflictError = "Lỗi !";
        return res.status(401).json({ conflictError });
      } else {
        return res.json(data);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const updateSong = (req, res) => {
  try {
    Song.update(req.params.songId, req.body, (err, data) => {
      if (err) {
        const conflictError = "Lỗi !";
        return res.status(401).json({ conflictError });
      } else {
        return res.json(data);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const likeSong = (req, res) => {
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
    if (!token) {
      const conflictError = "Không tìm thấy token !";
      return res.status(401).json({ conflictError });
    }

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
  createSong,
  updateSong,
  likeSong,
  unLikeSong,
};
