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
  const querySchema = Joi.object({
    q: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer().required().messages({
      "string.number": `limit trường là số`,
      "string.integer": `limit trường là số nguyên`,
      "any.required": `limit trường bắt buộc`,
    }),
    page: Joi.number().integer().required().messages({
      "string.number": `page trường là số`,
      "string.integer": `page trường là số nguyên`,
      "any.required": `page trường bắt buộc`,
    }),
  });

  const paramsSchema = Joi.object({
    userId: Joi.string().required(),
  });

  const { error: queryError, value: queryValue } = querySchema.validate(req.query);
  const { error: paramsError, value: paramsValue } = paramsSchema.validate(req.params);

  if (queryError) {
    return res.status(400).json({ conflictError: queryError.details[0].message });
  }

  if (paramsError) {
    return res.status(400).json({ conflictError: paramsError.details[0].message });
  }

  // Nếu dữ liệu hợp lệ, gán giá trị đã được xác thực vào req.query và req.params và chuyển sang middleware tiếp theo
  req.query = queryValue;
  req.params = paramsValue;
  next();
};

export const createPlaylist = (req, res, next) => {
  const schema = Joi.object({
    user_id: Joi.number().min(0).max(255).required(),
    title: Joi.string().min(0).max(255).required(),
    genre_id: Joi.number().required(),
    image_path: Joi.string().min(0).max(255).required(),
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

export default {
  getPlaylist,
  getAllPlaylist,
  createPlaylist,
};
