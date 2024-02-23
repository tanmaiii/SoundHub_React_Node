import { db, promiseDb } from "../config/connect.js";

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

Song.findById = (songId, result) => {
  db.query(`SELECT * from songs WHERE id = '${songId}'`, (err, res) => {
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

Song.getAll = async (query, result) => {
  const q = query?.q;
  const page = query?.page;
  const limit = query?.limit;
  const sortBy = query?.sortBy;

  const offset = (page - 1) * limit;

  const [data] = await promiseDb.query(`SELECT * FROM songs limit ${+limit} offset ${+offset}`);

  const [totalCount] = await promiseDb.query(`SELECT COUNT(*) AS totalCount FROM songs`);

  if (data && totalCount) {
    const totalPages = Math.ceil(totalCount[0].totalCount / limit);

    result(null, {
      data,
      pagination: {
        page: +page,
        limit: +limit,
        totalCount: totalCount[0].totalCount,
        totalPages,
      },
    });
    return;
  }
  result(null, null);
};

export default Song;
