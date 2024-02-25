import { query } from "express";
import Joi from "joi";

export const getPlaylist = (req, res, next) => {
  const schema = Joi.object({
    playlistId: Joi.string().required().messages({
      "string.string": `Email phải là chữ`,
      "string.empty": "playlistId không được bỏ trống",
      "any.required": `playlistId là trường bắt buộc`,
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

export const getAllPlaylist = (req, res, next) => {
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
  getPlaylist,
  getAllPlaylist,
};
