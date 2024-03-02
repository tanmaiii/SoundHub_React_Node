import User from "../model/user.model.js";
import jwtService from "../services/jwtService/index.js";

export const updateUser = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const userInfo = await jwtService.verifyToken(token);

    User.update(userInfo.id, req.body, (err, data) => {
      if (!data) {
        const conflictError = err;
        return res.status(401).json({ conflictError });
      } else {
        return res.json(data);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getUser = (req, res) => {
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
    res.status(400).json(error);
  }
};

export const getMe = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;

    const userInfo = await jwtService.verifyToken(token);

    User.findById(userInfo.id, (err, user) => {
      if (!user) {
        const conflictError = err;
        return res.status(401).json({ conflictError });
      } else {
        const { password, ...others } = user;
        return res.json(others);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getAllUser = (req, res) => {
  try {
    User.getAll(req.query, (err, user) => {
      if (!user) {
        const conflictError = err;
        return res.status(401).json({ conflictError });
      } else {
        return res.json(user);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getFollowed = (req, res) => {
  try {
    User.findFollowed(req.params.userId, req.query, (err, data) => {
      if (!data) {
        const conflictError = "Không tìm thấy";
        return res.status(401).json({ conflictError });
      } else {
        return res.json(data);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getFollower = (req, res) => {
  try {
    User.findFollower(req.params.userId, req.query, (err, data) => {
      if (!data) {
        const conflictError = "Không tìm thấy";
        return res.status(401).json({ conflictError });
      } else {
        return res.json(data);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const addFollow = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const userInfo = await jwtService.verifyToken(token);

    User.addFollow(userInfo.id, req.params.userId, (err, data) => {
      if (err) {
        const conflictError = err;
        return res.status(401).json({ conflictError });
      } else {
        return res.json("Thành công !");
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const removeFollow = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const userInfo = await jwtService.verifyToken(token);

    User.removeFollow(userInfo.id, req.params.userId, (err, data) => {
      if (err) {
        const conflictError = err;
        return res.status(401).json({ conflictError });
      } else {
        return res.json("Thành công !");
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

export default {
  getUser,
  getMe,
  updateUser,
  getAllUser,
  addFollow,
  removeFollow,
  getFollowed,
  getFollower,
};
