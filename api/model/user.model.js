import { db, promiseDb } from "../config/connect.js";
import bcrypt from "bcrypt";

const User = function (user) {
  this.email = user.email;
  this.password = user.password;
  this.name = user.name;
};

User.create = (newUser, result) => {
  db.query("insert into users set ? ", newUser, (err, res) => {
    if (err) {
      console.log("ERROR", err);
      result(err, null);
      return;
    }
    console.log("CREATE USER : ", { res });
    result(null, { id: res.insertId, ...newUser });
  });
};

User.findByEmail = (email, result) => {
  db.query(`SELECT * from users WHERE email = '${email}'`, (err, res) => {
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

User.findById = (id, result) => {
  db.query(`SELECT * from users WHERE id = '${id}'`, (err, res) => {
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

User.isEmailAlreadyExists = (email, result) => {
  db.query(`SELECT * from users WHERE email = '${email}'`, (err, res) => {
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

User.getAll = async (req, result) => {
  const q = req.query?.q;
  const page = req.query?.page;
  const limit = req.query?.limit;
  const sortBy = req.query?.sortBy;

  const offset = (page - 1) * limit;

  const [data] = await promiseDb.query(
    `SELECT email, name, image_path, verified, is_admin FROM users limit ${+limit} offset ${+offset}`
  );

  const [totalCount] = await promiseDb.query(`SELECT COUNT(*) AS totalCount FROM users`);

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

//followerId : người theo dõi,
//followedId : người được theo dõi,
User.addFollow = (followerId, followedId, result) => {
  User.findById(followedId, (err, user) => {
    if (err) {
      console.log("ERROR", err);
      result(err, null);
      return;
    }

    if (!user) {
      result("Người dùng không tồn tại", null);
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

User.removeFollow = (followerId, followedId, result) => {
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

export default User;
