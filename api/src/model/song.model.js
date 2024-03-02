import { db, promiseDb } from "../config/connect.js";

const Song = (song) => {
  this.title = song.title;
  this.image_path = song.image_path;
  this.song_path = song.song_path;
  this.private = song.private;
};

Song.create = (userId, newSong, result) => {
  db.query(`insert into songs set ? ,user_id = ${userId}`, newSong, (err, res) => {
    if (err) {
      console.log("ERROR", err);
      result(err, null);
      return;
    }
    console.log("CREATE SONG : ", { res });
    result(null, { id: res.insertId, ...newSong });
  });
};

Song.update = (songId, userId, newSong, result) => {
  Song.findById(songId, userId, (err, song) => {
    if (err) {
      console.log("ERROR", err);
      result(err, null);
      return;
    }
    if (song.user_id !== userId) {
      result("Không có quyền sửa", null);
      return;
    }
    db.query(`update songs set ? where id = ${song?.id}`, newSong, (err, res) => {
      if (err) {
        console.log("ERROR", err);
        result(err, null);
        return;
      }
      console.log("CREATE : ", { res });
      result(null, { id: songId, ...newSong });
    });
  });
};

Song.findById = (songId, userId, result) => {
  db.query(`SELECT * from songs WHERE id = '${songId}'`, (err, song) => {
    if (err) {
      result(err, null);
      return;
    }
    
    if (song.length) {
      if (song[0].private === 1 && song[0].user_id !== userId) {
        result("Bài hát đang ẩn", null);
        return;
      }else{
        result(null, song[0]);
        return;
      }
    }
    result(null, null);
  });
};

Song.findByPlaylistId = async (playlistId, query, result) => {
  const q = query?.q;
  const page = query?.page;
  const limit = query?.limit;
  const sort = query?.sort || "new";

  const offset = (page - 1) * limit;

  const [data] = await promiseDb.query(
    `SELECT * FROM playlist_songs as pvs , songs as s WHERE ${
      q ? ` s.title LIKE "%${q}%" AND` : ""
    }  pvs.playlist_id = ${playlistId} and pvs.song_id = s.id and s.private = 0 ` +
      `ORDER BY pvs.created_at ${sort === "new" ? "DESC" : "ASC"} limit ${+limit} offset ${+offset}`
  );

  const [totalCount] = await promiseDb.query(
    `SELECT COUNT(*) AS totalCount FROM playlist_songs as pvs , songs as s WHERE ${
      q ? ` s.title LIKE "%${q}%" AND` : ""
    } pvs.playlist_id = ${playlistId} and pvs.song_id = s.id  and s.private = 0 `
  );
  if (data && totalCount) {
    const totalPages = Math.ceil(totalCount[0].totalCount / limit);

    result(null, {
      data,
      pagination: {
        page: +page,
        limit: +limit,
        totalCount: totalCount[0].totalCount,
        totalPages,
        sort,
      },
    });
    return;
  }
  result(null, null);
};

Song.findByFavorite = async (userId, query, result) => {
  const q = query?.q;
  const page = query?.page;
  const limit = query?.limit;
  const sort = query?.sort || "new";

  const offset = (page - 1) * limit;

  const [data] = await promiseDb.query(
    `SELECT * FROM favourite_songs as fs , songs as s WHERE ${
      q ? ` s.title LIKE "%${q}%" AND` : ""
    } fs.user_id = ${userId} and fs.song_id = s.id and s.private = 0 ` +
      `ORDER BY fs.created_at ${sort === "new" ? "DESC" : "ASC"} limit ${+limit} offset ${+offset}`
  );

  const [totalCount] = await promiseDb.query(
    `SELECT COUNT(*) AS totalCount FROM favourite_songs as fs , songs as s WHERE ${
      q ? ` s.title LIKE "%${q}%" AND` : ""
    } fs.user_id = ${userId} and fs.song_id = s.id and s.private = 0`
  );
  if (data && totalCount) {
    const totalPages = Math.ceil(totalCount[0].totalCount / limit);

    result(null, {
      data,
      pagination: {
        page: +page,
        limit: +limit,
        totalCount: totalCount[0].totalCount,
        totalPages,
        sort,
      },
    });
    return;
  }
  result(null, null);
};

Song.findByUserId = async (userId, query, result) => {
  const q = query?.q;
  const page = query?.page;
  const limit = query?.limit;
  const sort = query?.sort || "new";

  const offset = (page - 1) * limit;

  const [data] = await promiseDb.query(
    `SELECT * FROM songs WHERE ${
      q ? ` title LIKE "%${q}%" AND` : ""
    } user_id = ${userId} AND private = 0 ` +
      `ORDER BY created_at ${sort === "new" ? "DESC" : "ASC"} limit ${+limit} offset ${+offset}`
  );

  const [totalCount] = await promiseDb.query(
    `SELECT COUNT(*) AS totalCount FROM songs WHERE ${
      q ? ` title LIKE "%${q}%" AND` : ""
    } user_id = ${userId} AND private = 0`
  );

  if (data && totalCount) {
    const totalPages = Math.ceil(totalCount[0].totalCount / limit);

    result(null, {
      data,
      pagination: {
        page: +page,
        limit: +limit,
        totalCount: totalCount[0].totalCount,
        totalPages,
        sort,
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
  const sort = query?.sortBy || "new";

  const offset = (page - 1) * limit;

  const [data] = await promiseDb.query(
    `SELECT * FROM songs WHERE ${q ? ` title LIKE "%${q}%" AND` : ""} private = 0 ` +
      `ORDER BY created_at ${sort === "new" ? "DESC" : "ASC"} limit ${+limit} offset ${+offset}`
  );

  const [totalCount] = await promiseDb.query(
    `SELECT COUNT(*) AS totalCount FROM songs WHERE ${
      q ? ` title LIKE "%${q}%" AND` : ""
    } private = 0 `
  );

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

Song.getMe = async (userId, query, result) => {
  const q = query?.q;
  const page = query?.page;
  const limit = query?.limit;
  const sort = query?.sort || "new";

  const offset = (page - 1) * limit;

  const [data] = await promiseDb.query(
    `SELECT * FROM songs WHERE ${
      q ? ` title LIKE "%${q}%" AND` : ""
    } user_id = ${userId}  ` +
      `ORDER BY created_at ${sort === "new" ? "DESC" : "ASC"} limit ${+limit} offset ${+offset}`
  );

  const [totalCount] = await promiseDb.query(
    `SELECT COUNT(*) AS totalCount FROM songs WHERE ${
      q ? ` title LIKE "%${q}%" AND` : ""
    } user_id = ${userId} `
  );

  if (data && totalCount) {
    const totalPages = Math.ceil(totalCount[0].totalCount / limit);

    result(null, {
      data,
      pagination: {
        page: +page,
        limit: +limit,
        totalCount: totalCount[0].totalCount,
        totalPages,
        sort,
      },
    });
    return;
  }
  result(null, null);
};

Song.like = (songId, userId, result) => {
  // Tìm kiếm bài hát theo id
  Song.findById(songId, userId, (err, song) => {
    if (err) {
      console.log("ERROR", err);
      result(err, null);
      return;
    }

    if (!song) {
      console.log("Song not found");
      result("Bài hát không tồn tại", null);
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
          console.log("Bài hát đã được thích bởi người dùng");
          result("Bài hát đã được thích bởi người dùng", null);
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
        console.log("Bài hát không được thích bởi người dùng");
        result("Bài hát không được thích bởi người dùng", null);
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
