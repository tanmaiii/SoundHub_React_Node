import { promiseDb, db } from "../config/connect.js";
import User from "../model/user.model.js";

export const signup = (req, res) => {};

export const signin = (req, res) => {
  User.getUserByEmail(req.body.email, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
};

export const signout = (req, res) => {};

export const resetPassword = (req, res) => {};

export default {
  signup,
  signin,
  signout,
  resetPassword,
};
