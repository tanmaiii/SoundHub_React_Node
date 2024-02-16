import { promiseDb, db } from "../config/connect.js";
import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    User.findByEmail(req.body.email, (err, user) => {
      if (err || user) {
        const conflictError = "User credentials are exist.";
        res.status(401).json({ user, conflictError });
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const user = new User({
          email: req.body.email,
          password: hashedPassword,
          name: req.body.name,
        });

        User.create(user, (err, result) => {
          if (err) {
            return res.json(err);
          }
          return res.json(result);
        });
      }
    });
  } catch (error) {
    const conflictError = "User credentials are not valid.";
    res.status(401).json({ conflictError });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    User.findByEmail(email, (err, user) => {
      if (!user) {
        const conflictError = "User does not exist";
        res.status(401).json({ conflictError });
      } else {
        bcrypt.compare(password, user.password, (err, result) => {
          if (result == true) {
            const token = jwt.sign({ id: user.id }, process.env.MY_SECRET, { expiresIn: "7d" });

            const { password, ...others } = user;

            res
              .cookie("accessToken", token, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                expires: new Date(Date.now() + 900000),
                maxAge: 24 * 60 * 60 * 1000,
              })
              .json(others);
          } else {
            // A user with that email address does not exists
            const conflictError = "User credentials are not valid.";
            res.json({ user, conflictError });
          }
        });
      }
    });
  } catch (error) {
    const conflictError = "User credentials are not valid.";
    res.status(401).json({ conflictError });
  }
};

export const signout = (req, res) => {
  res.clearCookie("accessToken");
  res.end();
};

export const resetPassword = (req, res) => {};

export const forgotPassword = (req, res) => {};

export default {
  signup,
  signin,
  signout,
  resetPassword,
};
