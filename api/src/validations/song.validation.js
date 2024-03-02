import Joi from "joi";

const bodySchema = {
  body: Joi.object().keys({
    title: Joi.string().min(0).max(255).required(),
    genre_id: Joi.number().required(),
    image_path: Joi.string().min(0).max(255).required(),
    song_path: Joi.string().min(0).max(255).required(),
    private: Joi.number().valid(0, 1),
  }),
};

const querySchema = {
  query: Joi.object().keys({
    q: Joi.string(),
    sort: Joi.string().valid("old", "new").default("new"),
    limit: Joi.number().integer().required(),
    page: Joi.number().integer().required(),
  }),
};

const cookieSchema = {
  cookies: Joi.object().keys({
    accessToken: Joi.string().required(),
  }),
};

export default class songValidation {
  static createSong = {
    ...bodySchema,
  };

  static updateSong = {
    ...bodySchema,
    cookies: Joi.object().keys({
      accessToken: Joi.string().required(),
    }),
  };

  static getSong = {
    params: Joi.object().keys({
      songId: Joi.number().integer().required(),
    }),
  };

  static getAllSong = {
    ...querySchema,
  };

  static getAllSongByMe = {
    ...querySchema,
    ...cookieSchema,
  };

  static getAllFavoritesByUser = {
    ...querySchema,
    ...cookieSchema,
  };

  static getAllSongByUser = {
    ...bodySchema,
    params: Joi.object().keys({
      userId: Joi.number().integer().required(),
    }),
  };

  static getAllSongByPlaylist = {
    ...bodySchema,
    params: Joi.object().keys({
      playlistId: Joi.number().integer().required(),
    }),
  };

  static like = {
    ...cookieSchema,
    params: Joi.object().keys({
      songId: Joi.number().integer().required(),
    }),
  };

  static unLike = {
    ...cookieSchema,
    params: Joi.object().keys({
      songId: Joi.number().integer().required(),
    }),
  };
}