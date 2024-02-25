import Playlist from "../model/playlist.model.js";

export const getPlaylist = (req, res) => {
  try {
    Playlist.findById(req.params.playlistId, (err, playlist) => {
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

export const getAllPlaylist = (req, res) => {
    try {
      Playlist.findByUserId(req.params.userId, (err, playlist) => {
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

export default {
  getPlaylist,
  getPlaylistByUser
};
