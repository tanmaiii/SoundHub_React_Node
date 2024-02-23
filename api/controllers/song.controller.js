import Song from "../model/song.model.js";

export const getSong = async (req, res) => {
  try {
    Song.findById(req.params.songId, (err, song) => {
      if (!song) {
        return res.json("Không tìm thấy");
      } else {
        return res.json(song);
      }
    });
  } catch (error) {
    res.status(401).json(error);
  }
};

export const getAllSong = async (req, res) => {};

export default {
  getSong,
  getAllSong,
};
