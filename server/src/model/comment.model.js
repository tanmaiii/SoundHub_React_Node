import { db, promiseDb } from "../config/connect.js";
import { v4 as uuidv4 } from "uuid";

const Comment = (comment) => {};

Comment.create = (userId, songId, content, result) => {
  const id = uuidv4();
  db.query(
    "INSERT INTO comments SET `id` = ?, `user_id` = ?, `song_id`= ?, `content`= ?",
    [id, userId, songId, content],
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

Comment.createReply = (userId, songId, content, parentId, result) => {
  const id = uuidv4();
  db.query(
    "INSERT INTO comments SET `id` = ?, `user_id` = ?, `song_id`= ?, `content`= ?, `parent_id`= ?",
    [id, userId, songId, content, parentId],
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
    `UPDATE SET ?, updated_at = '${moment(Date.now()).format(
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

  const [data] = await promiseDb.query(
    ` SELECT  c.id AS comment_id, c.song_id, c.user_id, u.name, u.image_path, c.content, c.created_at, c.updated_at,  ` +
      ` ( SELECT COUNT(*) FROM comments AS replies WHERE replies.parent_id = c.id ) AS replies_count ` +
      ` FROM  comments AS c ` +
      ` LEFT JOIN users AS u ON c.user_id = u.id ` +
      ` WHERE  c.parent_id IS NULL ` +
      ` AND c.song_id = '${songId}' ` +
      ` ORDER BY c.created_at ${sort === "new" ? "ASC" : "DESC"} ` +
      ` ${
        !+limit == 0 ? ` limit ${+limit} offset ${+(page - 1) * limit}` : ""
      } `
  );
  const [totalCount] = await promiseDb.query(
    ` SELECT COUNT(*) AS totalCount ` +
      ` FROM  comments AS c ` +
      ` LEFT JOIN users AS u ON c.user_id = u.id ` +
      ` WHERE  c.parent_id IS NULL ` +
      ` AND c.song_id = '${songId}' `
  );

  if (data && totalCount) {
    const totalPages = Math.ceil(totalCount[0]?.totalCount / limit);

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

Comment.findAllRepliesByCommentId = async (commentId, query, result) => {
  const q = query?.q;
  const page = query?.page;
  const limit = query?.limit;
  const sort = query?.sort || "new";

  const [data] = await promiseDb.query(
    ` SELECT  c.id AS comment_id, c.song_id, c.user_id, u.name, u.image_path, c.content, c.created_at, c.updated_at,  ` +
      ` ( SELECT COUNT(*) FROM comments AS replies WHERE replies.parent_id = c.id ) AS replies_count ` +
      ` FROM  comments AS c ` +
      ` LEFT JOIN users AS u ON c.user_id = u.id ` +
      ` WHERE c.parent_id = '${commentId}' ` +
      ` ORDER BY c.created_at ${sort === "new" ? "ASC" : "DESC"} ` +
      ` ${
        !+limit == 0 ? ` limit ${+limit} offset ${+(page - 1) * limit}` : ""
      } `
  );
  const [totalCount] = await promiseDb.query(
    ` SELECT COUNT(*) AS totalCount ` +
      ` FROM  comments AS c ` +
      ` LEFT JOIN users AS u ON c.user_id = u.id ` +
      ` WHERE c.parent_id =  '${commentId}'`
  );

  if (data && totalCount) {
    const totalPages = Math.ceil(totalCount[0]?.totalCount / limit);

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

Comment.like = (commentId, userId, result) => {
  db.query(
    `INSERT INTO comment_like SET comment_id = ?, user_id = ?`,
    [commentId, userId],
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
    `DELETE FROM comment_like WHERE comment_id = ? AND user_id = ?`,
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

Comment.findUserLikeComment = (commentId, result) => {
  db.query(
    `SELECT user_id FROM comment_like WHERE comment_id = ?`,
    [commentId],
    (err, data) => {
      if (err) {
        result(err, null);
        return;
      }

      if (data.length) {
        result(
          null,
          data.map((user) => user.user_id)
        );
        return;
      }

      result(null, null);
    }
  );
};

export default Comment;
