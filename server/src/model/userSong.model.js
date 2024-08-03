import { db, promiseDb } from "../config/connect.js";
import moment from "moment";
import User from "./user.model.js";

const UserSong = (song) => {
  this.user_id = song.user_id;
  this.song_id = song.song_id;
  this.confirm = song.created_at;
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
    `update user_songs set confirm = 1 where song_id = ${songId} and user_id = ${userId}`,
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

UserSong.find = (userId, songId, result) => {
  db.query(
    `SELECT user_songs.confirm from user_songs WHERE user_id = "${userId}" and song_id = "${songId}"`,
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

//Lấy các người dùng đã xác nhận tham gia vào bài hát
UserSong.findAllUserConfirm = (songId, result) => {
  db.query(
    `SELECT u.id ` +
      `FROM music.user_songs as us ` +
      `LEFT JOIN music.users as u ON us.user_id = u.id ` +
      `WHERE song_id = "${songId}" and us.user_id = u.id and us.confirm = 1`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.length) {
        const ids = res.map((row) => row.id);
        result(null, ids);
        return;
      }

      result(null, []);
    }
  );
};

//Lấy các người dùng
UserSong.findAllUser = (songId, userId, result) => {
  db.query(
    `SELECT u.id ` +
      `FROM music.user_songs as us ` +
      `LEFT JOIN music.users as u ON us.user_id = u.id ` +
      `WHERE song_id = "${songId}" and us.user_id = u.id `,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.length) {
        const ids = res.map((row) => row.id);
        result(null, ids);
        return;
      }

      result(null, null);
    }
  );
};

//Lấy tất cả bài hát mà người dùng đã tham gia
UserSong.findAllSong = (userId, result) => {
  db.query(
    `SELECT s.* from user_songs as us, song as s WHERE user_id = ${userId} and us.song_id = s.id`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (!res.length) {
        result("Không tìm thấy !", null);
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

export default UserSong;
