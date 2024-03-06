import { db, promiseDb } from "../config/connect.js";
import moment from "moment";

const SongPlay = (song) => {
  this.user_id = song.user_id;
  this.song_id = song.song_id;
  this.created_at = song.created_at;
};

SongPlay.recordSongPlay = (songId, userId, result) => {
  db.query(
    `INSERT INTO song_plays (song_id, user_id) VALUES (?, ?)`,
    [songId, userId],
    (err, res) => {
      if (err) {
        console.log("ERROR", err);
        result(err, null);
        return;
      }
      console.log("CREATE : ", { res });
      result(null, { song_id: songId, user_id: userId });
    }
  );
};

SongPlay.findBySongId = (songId, result) => {
  db.query(
    `SELECT COUNT(*) AS totalCount FROM song_plays WHERE song_id = ${songId}`,
    (err, song) => {
      if (err) {
        result(err, null);
        return;
      }

      if (song.length) {
        result(null, song[0].totalCount);
        return;
      }
      result("Không tìm thấy playlist !", null);
    }
  );
};



SongPlay.findByUserId = (userId, result) => {
  db.query(
    `SELECT COUNT(*) AS totalCount FROM song_plays WHERE user_id = ${userId} ORDER BY created_at ${sort === "new" ? "DESC" : "ASC"}`,
    (err, song) => {
      if (err) {
        result(err, null);
        return;
      }

      if (song.length) {
        result(null, song[0].totalCount);
        return;
      }
      result("Không tìm thấy playlist !", null);
    }
  );
};

export default SongPlay;
