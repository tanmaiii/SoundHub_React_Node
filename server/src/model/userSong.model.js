import { db, promiseDb } from "../config/connect.js";
import moment from "moment";
import User from "./user.model.js";

//'Pending' là trạng thái chờ xác nhận tham gia vào bài hát
//'Accepted' là trạng thái đã xác nhận tham gia vào bài hát
//'Rejected' là trạng thái bị từ chối tham gia vào bài hát

const UserSong = (userSong) => {
  this.user_id = userSong.user_id;
  this.song_id = userSong.song_id;
  this.status = userSong.status;
};

//Tạo mới người dùng tham gia vào bài hát
UserSong.create = (userId, songId, result) => {
  db.query(
    `INSERT INTO user_songs (song_id, user_id) VALUES (?, ?)`,
    [songId, userId],
    (err, res) => {
      if (err) {
        console.log("ERROR", err);
        return result(err, null);
      }
      return result(null, { song_id: songId, user_id: userId });
    }
  );
};

//Xác nhận tham gia vào bài hát
UserSong.confirm = (userId, songId, result) => {
  db.query(
    `update user_songs set status = "Accepted", response_at = ? where song_id = ? and user_id = ?`,
    [moment().format("YYYY-MM-DD HH:mm:ss"), songId, userId],
    (err, res) => {
      if (err) {
        console.log("ERROR", err);
        result(err, null);
        return;
      }
      console.log("UPDATE : ", { res });
      result(null, { song_id: songId, user_id: userId });
      return;
    }
  );
};

//Từ chối tham gia vào bài hát
UserSong.unConfirm = (userId, songId, result) => {
  db.query(
    `update user_songs set status = "Rejected", response_at = ? where song_id = ? and user_id = ?`,
    [moment().format("YYYY-MM-DD HH:mm:ss"), songId, userId],
    (err, res) => {
      if (err) {
        console.log("ERROR", err);
        result(err, null);
        return;
      }
      console.log("UPDATE : ", { res });
      result(null, { song_id: songId, user_id: userId });
      return;
    }
  );
};

//Xóa người dùng khỏi bài hát
UserSong.delete = (userId, songId, result) => {
  db.query(
    `DELETE FROM user_songs WHERE user_id = "${userId}" and song_id = "${songId}" `,
    (err, res) => {
      if (err) {
        console.log("ERROR", err);
        result(err, null);
        return;
      }
      result(null, { song_id: songId });
    }
  );
};

//Tìm kiếm
UserSong.find = (userId, songId, result) => {
  db.query(
    `SELECT * from user_songs WHERE user_id = "${userId}" and song_id = "${songId}"`,
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

//Lấy các người dùng
UserSong.findAllUser = async (songId, query, result) => {
  const q = query?.q;
  const page = query?.page || 1;
  const limit = query?.limit;
  const sort = query?.sortBy || "new";
  const status = query?.status || "all";

  const [data] = await promiseDb.query(
    `SELECT us.* ` +
      `FROM music.user_songs as us ` +
      `LEFT JOIN music.users as u ON us.user_id = u.id ` +
      `WHERE song_id = "${songId}" and us.user_id = u.id ` +
      ` ${status === "all" ? "" : `AND us.status = "${status}"`} ` +
      ` ${q ? `AND u.name LIKE "%${q}%"` : ""} ` +
      ` ORDER BY us.created_at ${sort === "new" ? "DESC" : "ASC"} ` +
      ` ${
        !+limit == 0 ? ` limit ${+limit} offset ${+(page - 1) * limit}` : ""
      } `
  );

  const [totalCount] = await promiseDb.query(
    `SELECT COUNT(*) as total ` +
      `FROM music.user_songs as us ` +
      `LEFT JOIN music.users as u ON us.user_id = u.id ` +
      `WHERE song_id = "${songId}" and us.user_id = u.id ` +
      ` ${status === "all" ? "" : `AND us.status = "${status}"`} `
  );

  if (data && totalCount) {
    const totalPages = Math.ceil(totalCount[0]?.totalCount / limit);

    result(null, {
      data,
      pagination: {
        page: +page,
        limit: +limit,
        totalCount: totalCount[0]?.totalCount || 0,
        totalPages,
        sort,
        q,
        status,
      },
    });

    return;
  }
  result(null, null);
};

//Lấy tất cả bài hát bởi người dùng
UserSong.findAllSong = async (userId, query, result) => {
  const q = query?.q;
  const page = query?.page || 1;
  const limit = query?.limit || 0;
  const sort = query?.sort || "new";

  const [data] = await promiseDb.query(
    `SELECT us.* from user_songs as us ` +
      ` LEFT JOIN songs as s ON us.song_id = s.id ` +
      ` WHERE us.user_id = "${userId}" ` +
      ` ${q ? ` AND u.title LIKE "%${q}%" AND` : ""} ` +
      ` ORDER BY us.created_at ${sort === "new" ? "DESC" : "ASC"} ` +
      ` ${
        !+limit == 0 ? ` limit ${+limit} offset ${+(page - 1) * limit}` : ""
      } `
  );

  const [totalCount] = await promiseDb.query(
    `SELECT COUNT(*) as total FROM user_songs as us ` +
      ` WHERE us.user_id = "${userId}" `
  );

  if (data && totalCount) {
    const totalPages = Math.ceil(totalCount[0].total / limit);

    result(null, {
      data,
      pagination: {
        page: +page,
        limit: +limit,
        totalCount: totalCount[0].total || 0,
        totalPages: totalPages || 1,
        sort,
      },
    });
    return;
  }
  result(null, null);
};

export default UserSong;
