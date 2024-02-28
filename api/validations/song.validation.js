import { query } from "express";
import Joi from "joi";

export const createSong = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(0).max(255).required(),
    user_id: Joi.number().min(0).max(255).required(),
    genre_id: Joi.number().required(),
    image_path: Joi.string().min(0).max(255).required(),
    song_path: Joi.string().min(0).max(255).required(),
    private: Joi.string().min(0).max(10),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ conflictError: error.details[0].message });
  }

  // Nếu dữ liệu hợp lệ, gán giá trị đã được xác thực vào req.body và chuyển sang middleware tiếp theo
  req.body = value;
  next();
};

export const updateSong = (req, res, next) => {
  const bodySchema = Joi.object({
    title: Joi.string().min(0).max(255),
    user_id: Joi.number().min(0).max(255),
    genre_id: Joi.number(),
    image_path: Joi.string().min(0).max(255),
    song_path: Joi.string().min(0).max(255),
    private: Joi.string().min(0).max(10),
  });

  const { error, value } = bodySchema.validate(req.body);

  if (error) {
    return res.status(400).json({ conflictError: error.details[0].message });
  }

  // Nếu dữ liệu hợp lệ, gán giá trị đã được xác thực vào req.body và chuyển sang middleware tiếp theo
  req.body = value;
  next();
};

export const getSong = (req, res, next) => {
  const schema = Joi.object({
    songId: Joi.string().required().messages({
      "string.string": `Email phải là chữ`,
      "string.empty": "songId không được bỏ trống",
      "any.required": `songId là trường bắt buộc`,
    }),
  });
  const { error, value } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({ conflictError: error.details[0].message });
  }
  // Nếu dữ liệu hợp lệ, gán giá trị đã được xác thực vào req.body và chuyển sang middleware tiếp theo
  req.params = value;
  next();
};

export const getAllSong = (req, res, next) => {
  const schema = Joi.object({
    q: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer().required(),
    page: Joi.number().integer().required(),
  });
  const { error, value } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({ conflictError: error.details[0].message });
  }
  // Nếu dữ liệu hợp lệ, gán giá trị đã được xác thực vào req.body và chuyển sang middleware tiếp theo
  req.query = value;
  next();
};

export const getAllSongByPlaylist = (req, res, next) => {
  const schema = Joi.object({
    q: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer().required(),
    page: Joi.number().integer().required(),
  });
  const { error, value } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({ conflictError: error.details[0].message });
  }
  // Nếu dữ liệu hợp lệ, gán giá trị đã được xác thực vào req.body và chuyển sang middleware tiếp theo
  req.query = value;
  next();
};

export default {
  createSong,
  updateSong,
  getSong,
  getAllSong,
  getAllSongByPlaylist,
};
