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

  const [data] = await promiseDb.query(`SELECT email, name, image_path, verified, is_admin FROM users limit ${+limit} offset ${+offset}`);

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

export default User;
