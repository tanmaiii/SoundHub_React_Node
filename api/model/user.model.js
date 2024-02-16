import { db } from "../config/connect.js";
import bcrypt from "bcrypt";

// const User = {
//   getAllUser: function (callback) {
//     return db.query("Select * from users", callback);
//   },

//   addUser: function (user, callback) {
//     const salt = bcrypt.genSaltSync(10);
//     const hashedPassword = bcrypt.hashSync(user.password, salt);

//     db.query(
//       "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
//       [user.email, hashedPassword, user.name],
//       callback
//     );
//   },

//   isEmailAlreadyExists: function async(email) {
//     return new Promise((resolve, reject) => {
//       db.query("SELECT COUNT(*) AS count FROM users WHERE email = ?", [email], (err, rows) => {
//         if (err) {
//           return reject(err);
//         }
//         resolve(rows[0].count > 0);
//       });
//     });
//   },

//   getUserById: function (id, callback) {
//     return db.query("SELECT * FROM users WHERE id = ?", [id], callback);
//   },

//   getUserByEmail: function (email, callback) {
//     return db.query("SELECT * FROM users WHERE email = ?", [email], callback);
//   },

//   getUserByName: function (name, callback) {
//     return db.query("SELECT * FROM users WHERE name = ?", [name], callback);
//   },

//   deleteUser: function (id, callback) {
//     return db.query("delete from users where Id=?", [id], callback);
//   },

//   updateUser: function (id, users, callback) {
//     return db.query(
//       "update users set name=?,class=?,dob=? where Id=?",
//       [users.name, users.class, users.dob, id],
//       callback
//     );
//   },
// };

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

User.getAll = (result) => {
  db.query(`SELECT * from users`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res);
      return;
    }
    result(null, null);
  });
};

export default User;
