import { query } from "express";
import Joi from "joi";

export const getUser = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Nếu dữ liệu hợp lệ, gán giá trị đã được xác thực vào req.body và chuyển sang middleware tiếp theo
  req.body = value;

  next();
};

export default {
  getUser,
};
