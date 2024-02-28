import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  try {
    User.findById(req.params.userId, (err, user) => {
      if (!user) {
        const conflictError = "Không tìm thấy!";
        return res.status(401).json({ conflictError });
      } else {
        const { password, ...others } = user;
        return res.json(others);
      }
    });
  } catch (error) {
    res.status(401).json(error);
  }
};

export const getMe = (req, res) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    const conflictError = "Không tìm thấy token!";
    return res.status(401).json({ conflictError });
  }

  try {
    jwt.verify(token, process.env.MY_SECRET, (err, userInfo) => {
      User.findById(userInfo.id, (err, user) => {
        if (!user) {
          const conflictError = "Không tìm thấy";
          return res.status(401).json({ conflictError });
        } else {
          const { password, ...others } = user;
          return res.json(others);
        }
      });
    });
  } catch (error) {
    res.status(401).json(error);
  }
};

export const getAllUser = async (req, res) => {
  try {
    User.getAll(req ,(err, user) => {
      if (!user) {
        const conflictError = "Không tìm thấy";
        return res.status(401).json({ conflictError });
      } else {
        return res.json(user);
      }
    });
  } catch (error) {
    res.status(401).json(error);
  }
};

export default {
  getUser,
  getMe,
  getAllUser,
};
