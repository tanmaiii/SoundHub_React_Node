import Song from "../model/song.model.js";
import jwtService from "../services/jwtService/index.js";

export const getSong = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const userInfo = await jwtService.verifyToken(token);

    Song.findById(req.params.songId, userInfo.id, (err, song) => {
      if (err) {
        return res.status(401).json({ conflictError: err });
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

export const getAllSongByMe = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const userInfo = await jwtService.verifyToken(token)
    
    Song.getMe(userInfo.id, req.query, (err, data) => {
      if (!data) {
        return res.status(401).json("Không tìm thấy");
      } else {
        return res.json(data);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
}

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

export const getAllFavoritesByUser = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const userInfo = await jwtService.verifyToken(token);

    Song.findByFavorite(userInfo.id, req.query, (err, data) => {
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

export const createSong = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const userInfo = await jwtService.verifyToken(token);

    Song.create(userInfo.id, req.body, (err, data) => {
      if (err) {
        const conflictError = err;
        return res.status(401).json({ conflictError });
      } else {
        return res.json(data);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const updateSong = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const userInfo = await jwtService.verifyToken(token);

    Song.update(req.params.songId, userInfo.id, req.body, (err, data) => {
      if (err) {
        const conflictError = err;
        return res.status(401).json({ conflictError });
      } else {
        return res.json(data);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const likeSong = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const userInfo = await jwtService.verifyToken(token);

    Song.like(req.params.songId, userInfo.id, (err, data) => {
      if (err) {
        const conflictError = err;
        return res.status(401).json({ conflictError });
      } else {
        return res.json(data);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const unLikeSong = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const userInfo = await jwtService.verifyToken(token);

    Song.unlike(req.params.songId, userInfo.id, (err, data) => {
      if (err) {
        const conflictError = err;
        return res.status(401).json({ conflictError });
      } else {
        return res.json(data);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export default {
  getSong,
  getAllSong,
  getAllSongByMe,
  getAllSongByPlaylist,
  getAllSongByUser,
  getAllFavoritesByUser,
  createSong,
  updateSong,
  likeSong,
  unLikeSong,
};
