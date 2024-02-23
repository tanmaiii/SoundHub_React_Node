import { db } from "../config/connect.js";

const Song = (song) => {
  this.title = song.title;
  this.image_path = song.image_path;
  this.song_path = song.song_path;
  this.private = song.private;
};

Song.create = (newSong, result) => {
  db.query("insert into songs set ? ", newSong, (err, res) => {
    if (err) {
      console.log("ERROR", err);
      result(err, null);
      return;
    }
    console.log("CREATE SONG : ", { res });
    result(null, { id: res.insertId, ...newSong });
  });
};

User.findById = (id, result) => {
  db.query(`SELECT * from songs WHERE id = '${id}'`, (err, res) => {
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

Song.getAll = (result) => {
  db.query(`SELECT * from songs`, (err, res) => {
    if (err) {
      console.log("ERROR", err);
      result(err, null);
      return;
    }
    if (res.length > 0) {
      result(null, res);
      return;
    }
    result(null, null);
  });
};

export default Song;
