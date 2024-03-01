import { query } from "express";
import Joi from "joi";

export const createSong = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(0).max(255).required(),
    genre_id: Joi.number().required(),
    image_path: Joi.string().min(0).max(255).required(),
    song_path: Joi.string().min(0).max(255).required(),
    private: Joi.number().valid(0, 1),
  });
  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ conflictError: error.details[0].message });
  } else {
    req.body = value;
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

export const updateSong = (req, res, next) => {
  const bodySchema = Joi.object({
    title: Joi.string().min(0).max(255),
    genre_id: Joi.number(),
    image_path: Joi.string().min(0).max(255),
    song_path: Joi.string().min(0).max(255),
    private: Joi.number().valid(0, 1),
  });

  const { error, value } = bodySchema.validate(req.body);

  if (error) {
    return res.status(400).json({ conflictError: error.details[0].message });
  } else {
    req.body = value;
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

export const getSong = (req, res, next) => {
  const schema = Joi.object({
    songId: Joi.number().integer().required(),
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
    sort: Joi.string().valid("old", "new").default("new"),
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
  const querySchema = Joi.object({
    q: Joi.string(),
    sort: Joi.string().valid("old", "new").default("new"),
    limit: Joi.number().integer().required(),
    page: Joi.number().integer().required(),
  });

  const paramsSchema = Joi.object({
    playlistId: Joi.number().integer().required(),
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

export const getAllSongByUser = (req, res, next) => {
  const querySchema = Joi.object({
    q: Joi.string(),
    sort: Joi.string().valid("old", "new").default("new"),
    limit: Joi.number().integer().required(),
    page: Joi.number().integer().required(),
  });

  const paramsSchema = Joi.object({
    userId: Joi.number().integer().required(),
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

export const getAllFavoritesByUser = (req, res, next) => {
  const querySchema = Joi.object({
    q: Joi.string(),
    sort: Joi.string().valid("old", "new").default("new"),
    limit: Joi.number().integer().required(),
    page: Joi.number().integer().required(),
  });

  const { error: queryError, value: queryValue } = querySchema.validate(req.query);

  if (queryError) {
    return res.status(400).json({ conflictError: queryError.details[0].message });
  } else {
    req.query = queryValue;
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

export const like = (req, res, next) => {
  const schema = Joi.object({
    songId: Joi.number().integer().required(),
  });

  const { error, value } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({ conflictError: error.details[0].message });
  } else {
    req.query = value;
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

export const unLike = (req, res, next) => {
  const schema = Joi.object({
    songId: Joi.number().integer().required(),
  });
  const { error, value } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({ conflictError: error.details[0].message });
  } else {
    req.query = value;
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

export default {
  createSong,
  updateSong,
  getSong,
  getAllSong,
  getAllSongByPlaylist,
  getAllSongByUser,
  getAllFavoritesByUser,
  like,
  unLike,
};
