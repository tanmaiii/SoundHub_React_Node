import { query } from "express";
import Joi from "joi";

export const getUser = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.number().min(1).max(255).required(),
  });

  const { error, value } = schema.validate(req.params);

  if (error) {
    return res.status(400).json({ conflictError: error.details[0].message });
  }

  // Nếu dữ liệu hợp lệ, gán giá trị đã được xác thực vào req.params và chuyển sang middleware tiếp theo
  req.params = value;

  next();
};

export const getMe = (req, res, next) => {
  const cookieSchema = Joi.object({
    accessToken: Joi.string().required(),
  });

  const { error: cookieError, value: cookieValue } = cookieSchema.validate(req.cookies);

  if (cookieError) {
    return res.status(400).json({ conflictError: cookieError.details[0].message });
  } else {
    req.cookies = cookieValue;
  }

  next();
};

export const getAllUser = (req, res, next) => {
  const querySchema = Joi.object({
    q: Joi.string(),
    sort: Joi.string().valid("old", "new").default("new"),
    limit: Joi.number().integer().required().messages({
      "string.number": `limit là truờng là số`,
      "string.integer": `limit là truờng là số nguyên`,
      "any.required": `limit là trường bắt buộc`,
    }),
    page: Joi.number().integer().required().messages({
      "string.number": `page là truờng là số`,
      "string.integer": `page là truờng là số nguyên`,
      "any.required": `page là trường bắt buộc`,
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

export const getFollowed = (req, res, next) => {
  const querySchema = Joi.object({
    q: Joi.string(),
    sort: Joi.string().valid("old", "new").default("new"),
    limit: Joi.number().integer().required().messages({
      "string.number": `limit là truờng là số`,
      "string.integer": `limit là truờng là số nguyên`,
      "any.required": `limit là trường bắt buộc`,
    }),
    page: Joi.number().integer().required().messages({
      "string.number": `page là truờng là số`,
      "string.integer": `page là truờng là số nguyên`,
      "any.required": `page là trường bắt buộc`,
    }),
  });

  const { error: queryError, value: queryValue } = querySchema.validate(req.query);

  if (queryError) {
    return res.status(400).json({ conflictError: queryError.details[0].message });
  } else {
    req.query = queryValue;
  }

  next();
};

export const getFollower = (req, res, next) => {
  const querySchema = Joi.object({
    q: Joi.string(),
    sort: Joi.string().valid("old", "new").default("new"),
    limit: Joi.number().integer().required().messages({
      "string.number": `limit là truờng là số`,
      "string.integer": `limit là truờng là số nguyên`,
      "any.required": `limit là trường bắt buộc`,
    }),
    page: Joi.number().integer().required().messages({
      "string.number": `page là truờng là số`,
      "string.integer": `page là truờng là số nguyên`,
      "any.required": `page là trường bắt buộc`,
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
  } else {
    req.params = value;
  }

  // kiểm tra cookie token
  const cookieSchema = Joi.object({
    accessToken: Joi.string().required(),
  });

  const { error: cookieError, value: cookieValue } = cookieSchema.validate(req.cookies);

  if (cookieError) {
    return res.status(400).json({ conflictError: cookieError.details[0].message });
  } else {
    req.cookies = cookieValue;
  }
  //

  next();
};

export const removeFollow = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.number().min(1).max(255).required(),
  });

  const { error, value } = schema.validate(req.params);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  } else {
    req.params = value;
  }

  const cookieSchema = Joi.object({
    accessToken: Joi.string().required(),
  });

  const { error: cookieError, value: cookieValue } = cookieSchema.validate(req.cookies);

  if (cookieError) {
    return res.status(400).json({ conflictError: cookieError.details[0].message });
  } else {
    req.cookies = cookieValue;
  }
  
  next();
};

export default {
  getUser,
  getMe,
  getAllUser,
  getFollowed,
  getFollower,
  addFollow,
  removeFollow,
};
