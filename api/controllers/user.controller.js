import User from "../model/user.model.js";

export const getUser = async (req, res) => {
  try {
    User.findById(req.params.userId, (err, user) => {
      if (!user) {
        return res.json("Không tìm thấy");
      } else {
        const { password, ...others } = user;

        return res.json(others);
      }
    });
  } catch (error) {
    res.status(401).json(error);
  }
};

export const getAllUser = async (req, res) => {
  try {
    User.getAll((err, user) => {
      if (!user) {
        return res.json("Không tìm thấy");
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
  getAllUser,
};
