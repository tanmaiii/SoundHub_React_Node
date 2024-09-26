import { db, promiseDb } from "../config/connect.js";

const Comment = (comment) => {};

Comment.create = (userId, songId, content, result) => {
  db.query(
    "INSERT INTO comments SET `user_id` = ?, `song_id`= ?, `content`= ?",
    [userId, songId, content],
    (insertErr, insertRes) => {
      if (insertErr) {
        console.log("ERROR", insertErr);
        result(insertErr, null);
        return;
      }
      result(null, { userId, songId, content });
    }
  );
};

Comment.update = (commentId, newUpdate, result) => {
  db.query(
    `UPDATE SET ?, update_at = '${moment(Date.now()).format(
      "YYYY-MM-DD HH:mm:ss"
    )}' where id = ?`,
    [newUpdate, commentId],
    (insertErr, insertRes) => {
      if (insertErr) {
        console.log("ERROR", insertErr);
        result(insertErr, null);
        return;
      }
      result(null, { id: commentId });
    }
  );
};

Comment.delete = (commentId, result) => {
  db.query(
    "DELETE FROM comments WHERE id = ?",
    [commentId],
    (deleteErr, insertRes) => {
      if (deleteErr) {
        console.log("ERROR", deleteErr);
        result(deleteErr, null);
        return;
      }
      result(null, { id: commentId });
    }
  );
};

Comment.findById = (commentId, result) => {
  db.query(
    `SELECT * FROM comments WHERE id = ?`,
    [commentId],
    (err, comment) => {
      if (err) {
        result(err, null);
        return;
      }

      if (comment.length) {
        result(null, comment[0]);
        return;
      }

      result(null, null);
    }
  );
};

Comment.findAllBySongId = async (songId, query, result) => {
  const q = query?.q;
  const page = query?.page;
  const limit = query?.limit;
  const sort = query?.sort || "new";
};

Comment.like = (commentId, userId, result) => {
  db.query(
    `INSERT INTO comment_likes SET ?`,
    { commentId, userId },
    (insertErr, insertRes) => {
      if (insertErr) {
        console.log("ERROR", insertErr);
        result(insertErr, null);
        return;
      }
      result(null, { commentId, userId });
    }
  );
};

Comment.unLike = (commentId, userId, result) => {
  db.query(
    `DELETE FROM comment_likes WHERE commentId = ? AND userId = ?`,
    [commentId, userId],
    (deleteErr, insertRes) => {
      if (deleteErr) {
        console.log("ERROR", deleteErr);
        result(deleteErr, null);
        return;
      }
      result(null, { commentId, userId });
    }
  );
};

Comment.countLikes = (songId, result) => {
  db.query(
    `SELECT count as totalCount FROM comment_likes_count where comment_id = ?`,
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
      result("Không tìm thấy !", null);
    }
  );
};

export default Comment;
