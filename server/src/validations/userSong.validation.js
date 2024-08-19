import Joi from "joi";

const querySchema = {
  query: Joi.object().keys({
    q: Joi.string().allow(null, "").optional(),
    sortBy: Joi.string().valid("old", "new").default("new"),
    limit: Joi.number().integer().required(),
    page: Joi.number().integer().required(),
    status: Joi.string()
      .valid("Pending", "Accepted", "Rejected")
      .default("all"),
  }),
};

export default class songValidation {
  static getAllUser = {
    ...querySchema,
    params: Joi.object().keys({
      songId: Joi.string().min(0).max(36).required(),
    }),
  };

  static getAllSongByMe = {
    ...querySchema,
  };

  static checkUserConfirm = {
    query: Joi.object().keys({
      songId: Joi.string().min(0).max(36).required(),
      userId: Joi.string().min(0).max(36).required(),
    }),
  };

  static createUserSong = {
    body: Joi.object().keys({
      songId: Joi.string().min(0).max(36).required(),
      userId: Joi.string().min(0).max(36).required(),
    }),
  };

  static deleteUserSong = {
    query: Joi.object().keys({
      songId: Joi.string().min(0).max(36).required(),
      userId: Joi.string().min(0).max(36).required(),
    }),
  };

  static confirmUserSong = {
    params: Joi.object().keys({
      songId: Joi.string().min(0).max(36).required(),
    }),
  };

  static unConfirmUserSong = {
    params: Joi.object().keys({
      songId: Joi.string().min(0).max(36).required(),
    }),
  };
}
