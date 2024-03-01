import Joi from "joi";

export const getPlaylist = (req, res, next) => {
  const schema = Joi.object({
    playlistId: Joi.number().integer().required(),
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

  next();
};

export const getAllPlaylistByMe = (req, res, next) => {
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

export const getAllPlaylistByUser = (req, res, next) => {
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
  } else {
    req.query = queryValue;
  }

  if (paramsError) {
    return res.status(400).json({ conflictError: paramsError.details[0].message });
  } else {
    req.params = paramsValue;
  }

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

export const like = (req, res, next) => {
  const schema = Joi.object({
    playlistId: Joi.number().integer().required(),
  });
  const { error, value } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({ conflictError: error.details[0].message });
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

export const unLike = (req, res, next) => {
  const schema = Joi.object({
    playlistId: Joi.number().min(1).max(255).required(),
  });
  const { error, value } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({ conflictError: error.details[0].message });
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

export const addSong = (req, res, next) => {
  const schema = Joi.object({
    playlist_id: Joi.number().min(1).max(255).required(),
    song_id: Joi.number().min(1).max(255).required(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ conflictError: error.details[0].message });
  } else {
    // Nếu dữ liệu hợp lệ, gán giá trị đã được xác thực vào req.body và chuyển sang middleware tiếp theo
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

export const unAddSong = (req, res, next) => {
  const schema = Joi.object({
    playlist_id: Joi.number().min(1).max(255).required(),
    song_id: Joi.number().min(1).max(255).required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ conflictError: error.details[0].message });
  } else {
    // Nếu dữ liệu hợp lệ, gán giá trị đã được xác thực vào req.body và chuyển sang middleware tiếp theo
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
  getPlaylist,
  getAllPlaylist,
  getAllPlaylistByMe,
  getAllPlaylistByUser,
  createPlaylist,
  like,
  unLike,
  addSong,
  unAddSong,
};
