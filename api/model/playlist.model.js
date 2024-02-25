import { db } from "../config/connect.js";

const Playlist = (playlist) => {
  this.id = playlist.id;
  this.name = playlist.name;
  this.user_id = playlist.user_id;
  this.genre_id = playlist.genre_id;
};

Playlist.findById = (playlistId, result) => {
  db.query(`SELECT * from playlists WHERE id = '${playlistId}'`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res[0]);
      return;
    }
    result(null, null);
  });
};

Playlist.findByUserId = (userId, result) => {
  db.query(`SELECT * from playlists WHERE user_id = '${userId}'`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res);
      return;
    }
    result(null, null);
  });
};

export default Playlist;
