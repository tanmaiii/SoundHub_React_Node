import { query } from "express";
import Joi from "joi";

export const getUser = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.number().min(1).max(255).required(),
  });

  const { error, value } = schema.validate(req.params);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Nếu dữ liệu hợp lệ, gán giá trị đã được xác thực vào req.params và chuyển sang middleware tiếp theo
  req.params = value;

  next();
};

export const getAllUser = (req, res, next) => {
  const querySchema = Joi.object({
    q: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer().required().messages({
      "string.number": `limit Truờng là số`,
      "string.integer": `limit Truờng là số nguyên`,
      "any.required": `limit Trường bắt buộc`,
    }),
    page: Joi.number().integer().required().messages({
      "string.number": `page Truờng là số`,
      "string.integer": `page Truờng là số nguyên`,
      "any.required": `page Trường bắt buộc`,
    }),
  });

  const { error: queryError, value: queryValue } = querySchema.validate(req.query);

  if (queryError) {
    return res.status(400).json({ conflictError: queryError.details[0].message });
  }

  // Nếu dữ liệu hợp lệ, gán giá trị đã được xác thực vào req.query và req.params và chuyển sang middleware tiếp theo
  req.query = queryValue;
  next();
};

export const addFollow = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.number().min(1).max(255).required(),
  });

  const { error, value } = schema.validate(req.params);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Nếu dữ liệu hợp lệ, gán giá trị đã được xác thực vào req.body và chuyển sang middleware tiếp theo
  req.params = value;

  next();
}

export const removeFollow = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.number().min(1).max(255).required(),
  });

  const { error, value } = schema.validate(req.params);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Nếu dữ liệu hợp lệ, gán giá trị đã được xác thực vào req.body và chuyển sang middleware tiếp theo
  req.params = value;

  next();
}

export default {
  getUser,
  getAllUser,
  addFollow,
  removeFollow
};
