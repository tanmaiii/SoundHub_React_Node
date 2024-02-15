import { db } from "../config/connect.js";
import bcrypt from "bcrypt";

const User = {
  getAllUser: function (callback) {
    return db.query("Select * from users", callback);
  },

  addUser: function (user, callback) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(user.password, salt);

    db.query(
      "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
      [user.email, hashedPassword, user.name],
      callback
    );
  },

  isEmailAlreadyExists: function async(email) {
    return new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) AS count FROM users WHERE email = ?", [email], (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows[0].count > 0);
      });
    });
  },

  getUserByEmail: function (email, callback) {
    return db.query("SELECT * FROM users WHERE email = ?", [email], callback);
  },

  deleteUser: function (id, callback) {
    return db.query("delete from users where Id=?", [id], callback);
  },

  updateUser: function (id, users, callback) {
    return db.query(
      "update users set name=?,class=?,dob=? where Id=?",
      [users.name, users.class, users.dob, id],
      callback
    );
  },
};

export default User;
