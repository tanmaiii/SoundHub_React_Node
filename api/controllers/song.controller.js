import Song from "../model/song.model.js";

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
    res.status(401).json(error);
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
    res.status(401).json(error);
  }
};

export const createSong = (req, res) => {
  try {
    console.log(req.body);
    Song.create(req.body, (err, data) => {
      if (err) {
        const conflictError = "Lỗi !";
        return res.status(401).json({ conflictError });
      } else {
        return res.json(data);
      }
    });
  } catch (error) {
    res.status(401).json(error);
  }
};

export const updateSong = (req, res) => {
  try {
  } catch (error) {}
};

export default {
  getSong,
  getAllSong,
  createSong,
  updateSong,
};
