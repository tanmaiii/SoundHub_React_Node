import Song from "../model/song.model.js";

export const getSong = (req, res) => {
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

export const getAllSong = (req, res) => {
  try {
    Song.getAll(req.query, (err, data) => {
      if (!data) {
        return res.json("Không tìm thấy");
      } else {
        return res.json(data);
      }
    });
  } catch (error) {
    res.status(401).json(error);
  }
};


export const addSong = (req, res)  => {
  try {
    
  } catch (error) {
    
  }
}

export default {
  getSong,
  getAllSong,
};
