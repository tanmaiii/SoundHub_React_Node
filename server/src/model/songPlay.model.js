import { db, promiseDb } from "../config/connect.js";

const SongPlay = (song) => {
  this.user_id = song.user_id;
  this.song_id = song.song_id;
  this.created_at = song.created_at;
};

SongPlay.create = (userId, songId, result) => {
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

SongPlay.countSongPlays = (songId, result) => {
  db.query(
    `SELECT COUNT(*) AS totalCount FROM song_plays WHERE song_id = ?`,
    [songId],
    (err, song) => {
      if (err) {
        result(err, null);
        return;
      }

      if (song.length) {
        result(null, song[0].totalCount);
        return;
      }
      result("Không tìm thấy bài hát !", null);
    }
  );
};

SongPlay.find = (userId, songId, result) => {
  db.query(
    `SELECT * from song_plays WHERE user_id = '${userId}' and song_id= '${songId}'`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res[0]);
        return;
      }

      result(null, null);
    }
  );
};

SongPlay.findAllByUserId = async (userId, query, result) => {
  const q = query?.q;
  const page = query?.page;
  const limit = query?.limit;
  const sort = query?.sortBy || "new";

  const [data] = await promiseDb.query(
    ` SELECT DISTINCT s.*, u.name as author, slc.count as count, sp.created_at as created_at_play` +
      ` FROM music.song_plays as sp` +
      ` LEFT JOIN music.songs AS s ON sp.song_id = s.id` +
      ` LEFT JOIN music.users AS u ON s.user_id = u.id ` +
      ` LEFT JOIN music.song_listens_count AS slc ON s.id = slc.song_id ` +
      ` WHERE ((s.public = 1 AND sp.user_id = '${userId}' ) OR (sp.user_id = '${userId}' AND s.user_id = sp.user_id)) AND is_deleted = 0 ` +
      ` ${q ? ` AND s.title LIKE "%${q}%" ` : ""} ` +
      ` ORDER BY sp.created_at ${sort === "new" ? "DESC" : "ASC"} ` +
      ` ${
        !+limit == 0 ? ` limit ${+limit} offset ${+(page - 1) * limit}` : ""
      } `
  );

  const [totalCount] = await promiseDb.query(
    ` SELECT count(DISTINCT sp.song_id) as totalCount ` +
      ` FROM music.song_plays as sp` +
      ` LEFT JOIN music.songs AS s ON sp.song_id = s.id` +
      ` LEFT JOIN music.users AS u ON s.user_id = u.id ` +
      ` LEFT JOIN music.song_listens_count AS slc ON s.id = slc.song_id ` +
      ` WHERE ((s.public = 1 AND sp.user_id = '${userId}' ) OR (sp.user_id = '${userId}' AND s.user_id = sp.user_id)) AND is_deleted = 0 ` +
      ` ${q ? ` AND s.title LIKE "%${q}%" ` : ""} `
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

export default SongPlay;
