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

Song.update = (songId, newSong, result) => {
  Song.findById(songId, (err, song) => {
    if (err) {
      console.log("ERROR", err);
      result(err, null);
      return;
    } else {
      db.query(`update songs set ? where id = ${song?.id}`, newSong, (err, res) => {
        if (err) {
          console.log("ERROR", err);
          result(err, null);
          return;
        }
        console.log("CREATE : ", { res });
        result(null, { id: songId, ...newSong });
      });
    }
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

Song.findByPlaylistId = async (req, result) => {
  const q = req.query?.q;
  const page = req.query?.page;
  const limit = req.query?.limit;
  const sortBy = req.query?.sortBy;

  const offset = (page - 1) * limit;

  const playlistId = req.params.playlistId;
  console.log(playlistId);

  const [data] = await promiseDb.query(
    `SELECT * FROM music.playlist_songs as pvs , music.songs as s WHERE pvs.playlist_id = ${playlistId} and pvs.song_id = s.id ` +
      `limit ${+limit} offset ${+offset}`
  );

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

Song.like = (songId, userId, result) => {
  // Tìm kiếm bài hát theo id
  Song.findById(songId, (err, song) => {
    if (err) {
      console.log("ERROR", err);
      result(err, null);
      return;
    }

    if (!song) {
      console.log("Song not found");
      result({ message: "Song not found" }, null);
      return;
    }

    // Kiểm tra xem người dùng đã thích bài hát này chưa
    db.query(
      "SELECT * FROM favourite_songs WHERE user_id = ? AND song_id = ?",
      [userId, songId],
      (queryErr, rows) => {
        if (queryErr) {
          console.log("ERROR", queryErr);
          result(queryErr, null);
          return;
        }

        // Nếu người dùng đã thích bài hát này trước đó, không thực hiện thêm
        if (rows.length > 0) {
          console.log("Song already liked by the user");
          result({ message: "Song already liked by the user" }, null);
          return;
        }

        // Thêm bài hát vào danh sách bài hát yêu thích của người dùng
        db.query(
          "INSERT INTO favourite_songs SET `user_id` = ?, `song_id`= ?",
          [userId, songId],
          (insertErr, insertRes) => {
            if (insertErr) {
              console.log("ERROR", insertErr);
              result(insertErr, null);
              return;
            }
            // Trả về thông tin bài hát đã được thêm vào danh sách yêu thích
            result(null, { song_id: songId, user_id: userId });
          }
        );
      }
    );
  });
};


Song.unlike = (songId, userId, result) => {
  // Kiểm tra xem bài hát đã được yêu thích bởi người dùng chưa
  db.query(
    "SELECT * FROM favourite_songs WHERE user_id = ? AND song_id = ?",
    [userId, songId],
    (queryErr, rows) => {
      if (queryErr) {
        console.log("ERROR", queryErr);
        result(queryErr, null);
        return;
      }

      // Nếu không tìm thấy bài hát trong danh sách yêu thích của người dùng, trả về lỗi
      if (rows.length === 0) {
        console.log("Song not liked by the user");
        result({ message: "Song not liked by the user" }, null);
        return;
      }

      // Xóa bài hát khỏi danh sách yêu thích của người dùng
      db.query(
        "DELETE FROM favourite_songs WHERE user_id = ? AND song_id = ?",
        [userId, songId],
        (deleteErr, deleteRes) => {
          if (deleteErr) {
            console.log("ERROR", deleteErr);
            result(deleteErr, null);
            return;
          }
          // Trả về thông tin bài hát đã bị xóa khỏi danh sách yêu thích
          result(null, { song_id: songId, user_id: userId });
        }
      );
    }
  );
};

export default Song;
