import { db, promiseDb } from "../config/connect.js";
import User from "./user.model.js";

const Follow = (follow) => {};

//followerId: người đang theo dõi,
//followedId: người được theo dõi,
Follow.create = (followerId, followedId, result) => {
  User.findById(followedId, (err, user) => {
    if (err) {
      console.log("ERROR", err);
      result(err, null);
      return;
    }

    if (!user) {
      result("Không tìm thấy người dùng !", null);
      return;
    }

    db.query(
      "SELECT * FROM follows WHERE follower_user_id = ? AND followed_user_id = ?",
      [followerId, followedId],
      (queryErr, rows) => {
        if (queryErr) {
          console.log("ERROR", queryErr);
          result(queryErr, null);
          return;
        }

        // Nếu người dùng đã thích bài hát này trước đó, không thực hiện thêm
        if (rows.length > 0) {
          console.log("Người dùng này đã được theo dõi");
          result("Người dùng này đã được theo dõi", null);
          return;
        }

        // Thêm bài hát vào danh sách bài hát yêu thích của người dùng
        db.query(
          "INSERT INTO follows SET `follower_user_id` = ?, `followed_user_id`= ?",
          [followerId, followedId],
          (insertErr, insertRes) => {
            if (insertErr) {
              console.log("ERROR", insertErr);
              result(insertErr, null);
              return;
            }
            result(null, { follower_user_id: followerId, followed_user_id: followedId });
          }
        );
      }
    );
  });
};

Follow.delete = (followerId, followedId, result) => {
  db.query(
    "SELECT * FROM follows WHERE follower_user_id = ? AND followed_user_id = ?",
    [followerId, followedId],
    (queryErr, rows) => {
      if (queryErr) {
        console.log("ERROR", queryErr);
        result(queryErr, null);
        return;
      }

      if (rows.length === 0) {
        result("Người dùng này không được theo dõi", null);
        return;
      }

      db.query(
        "DELETE FROM follows WHERE follower_user_id = ? AND followed_user_id= ?",
        [followerId, followedId],
        (deleteErr, insertRes) => {
          if (deleteErr) {
            console.log("ERROR", deleteErr);
            result(deleteErr, null);
            return;
          }
          result(null, { follower_user_id: followerId, followed_user_id: followedId });
        }
      );
    }
  );
};

// trả về tất cả các người dùng đang theo dõi
Follow.findAllByFollowerId = async (userId, query, result) => {
  const q = query?.q;
  const page = query?.page;
  const limit = query?.limit;
  const sort = query?.sortBy || "new";

  const offset = (page - 1) * limit;

  const [data] = await promiseDb.query(
    `SELECT id, name, verified, image_path ,is_admin  FROM music.follows, music.users WHERE follows.followed_user_id = users.id AND follows.follower_user_id = ${userId} ${
      q ? `AND users.name LIKE "%${q}%"` : ""
    }` + `ORDER BY created_at ${sort === "new" ? "DESC" : "ASC"} limit ${+limit} offset ${+offset}`
  );

  const [totalCount] = await promiseDb.query(
    `SELECT COUNT(*) AS totalCount FROM follows where follower_user_id = ${userId} ${
      q ? `AND title LIKE "%${q}%"` : ""
    }`
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

// trả về tất cả các người dùng đang theo dõi mình
Follow.findAllByFollowedId = async (userId, query, result) => {
  const q = query?.q;
  const page = query?.page;
  const limit = query?.limit;
  const sort = query?.sortBy || "new";

  const offset = (page - 1) * limit;

  const [data] = await promiseDb.query(
    `SELECT id, name, verified, image_path ,is_admin  FROM music.follows, music.users WHERE follows.followed_user_id = users.id AND follows.followed_user_id = ${userId} ${
      q ? `AND users.name LIKE "%${q}%"` : ""
    }` + `ORDER BY created_at ${sort === "new" ? "DESC" : "ASC"} limit ${+limit} offset ${+offset}`
  );

  const [totalCount] = await promiseDb.query(
    `SELECT COUNT(*) AS totalCount FROM follows where followed_user_id = ${userId} ${
      q ? `AND title LIKE "%${q}%"` : ""
    }`
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

Follow.countFollowers = async (userId, result) => {
  const count = await promiseDb.query(
    `SELECT COUNT(*) AS total  FROM follows where followed_user_id = ${userId} ${
      q ? `AND title LIKE "%${q}%"` : ""
    }`
  );

  if (count) {
    result(null, count[0].total);
    return;
  }
  result(null, null);
};

export default Follow;
