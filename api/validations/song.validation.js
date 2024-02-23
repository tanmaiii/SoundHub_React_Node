import { query } from "express";
import Joi from "joi";

export const createSong = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(0).max(255).required(),
    genreId: Joi.number().required(),
    imagePath: Joi.string().min(0).max(255).required(),
    mp3Path: Joi.string().min(0).max(255).required(),
    private: Joi.string().min(0).max(10),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
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
    return res.status(400).json({ error: error.details[0].message });
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
    return res.status(400).json({ error: error.details[0].message });
  }
  // Nếu dữ liệu hợp lệ, gán giá trị đã được xác thực vào req.body và chuyển sang middleware tiếp theo
  req.query = value;
  next();
};

export default {
  getSong,
  getAllSong
};
