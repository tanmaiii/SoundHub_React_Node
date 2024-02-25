import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  try {
    User.findById(req.params.userId, (err, user) => {
      if (!user) {
        return res.status(401).json("Không tìm thấy!");
      } else {
        const { password, ...others } = user;
        return res.json(others);
      }
    });
  } catch (error) {
    res.status(401).json(error);
  }
};

export const getOwnerUser = (req, res) => {
  const token = req.cookies?.accessToken;
  if (!token) return res.status(401).json("Không tìm thấy token!");

  try {
    jwt.verify(token, process.env.MY_SECRET, (err, userInfo) => {
      User.findById(userInfo.id, (err, user) => {

        if (!user) {
          return res.status(401).json("Không tìm thấy 123");
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
    User.getAll((err, user) => {
      if (!user) {
        return res.status(401).json("Không tìm thấy");
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
  getOwnerUser,
  getAllUser,
};
