import { promiseDb, db } from "../config/connect.js";
import User from "../model/user.model.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  if (!(await User.isEmailAlreadyExists(req.body.email))) {
    User.addUser(req.body, (err, result) => {
      if (err) throw err;
      if (result) return res.json(result);
    });
  } else {
    res.json("Email đã tồn tại");
  }
};

export const signin = async (req, res) => {
  if (await User.isEmailAlreadyExists(req.body.email)) {
    User.getUserByEmail(req.body.email, (err, result) => {
      if (err) throw err;

      if (result) {
        const checkPassword = bcrypt.compareSync(req.body.password, result[0].password);
        if (!checkPassword) return res.status(401).json("Sai mật khẩu");

        const token = jwt.sign({ id: data[0].id }, process.env.MY_SECRET, { expiresIn: "7d" });


        res.json(result);
      }
    });
  } else {
    res.json("Email không tồn tại");
  }
};

export const signout = (req, res) => {};

export const resetPassword = (req, res) => {};

export default {
  signup,
  signin,
  signout,
  resetPassword,
};
