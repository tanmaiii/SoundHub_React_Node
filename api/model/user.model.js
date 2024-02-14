import { db } from "../config/connect.js";

const User = {
  getAllUser: function (callback) {
    return db.query("Select * from users", callback);
  },
  getUserByEmail: function (email, callback) {
    return db.query("Select * FROM users where email = ?", [email], callback);
  },
  addUser: function (user, callback) {
    return db.query(
      "Insert into users(name,class,dob) values(?,?,?)",
      [user.name, user.email],
      callback
    );
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
