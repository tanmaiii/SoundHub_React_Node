import SongPlay from "../model/songPlay.model.js";
import Song from "../model/song.model.js";
import jwtService from "../services/jwtService.js";

export const playSong = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const userInfo = await jwtService.verifyToken(token);

    Song.findById(req.params.songId, userInfo.id, (err, song) => {
      if (!song || err) {
        return res.status(401).json({ conflictError: err });
      }
      if (song) {
        SongPlay.create(userInfo.id, song.id, (err, songPlay) => {
          if (err || !songPlay) {
            return res.status(401).json({ conflictError: err });
          }
          console.log("PLAY SONG: ", song?.title);
          return res.json(song);
        });
      }
    });

    return;
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getCount = (req, res) => {
  try {
    SongPlay.countSongPlays(req.params.songId, (err, data) => {
      if (err) {
        return res.status(401).json({ conflictError: err });
      }
      return res.json(data);
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getAllSongByUser = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const userInfo = await jwtService.verifyToken(token);

    SongPlay.findAllByUserId(userInfo.id, req.query, (err, data) => {
      if (!data || err) {
        return res.status(401).json("Không tìm thấy");
      } else {
        return res.json(data);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export default {
  playSong,
  getCount,
  getAllSongByUser,
};
