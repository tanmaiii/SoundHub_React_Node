import Joi from "joi";

const querySchema = {
  query: Joi.object().keys({
    q: Joi.string().allow(null, "").optional(),
    sortBy: Joi.string().valid("old", "new").default("new"),
    limit: Joi.number().integer().required(),
    page: Joi.number().integer().required(),
  }),
};

export default class songValidation {
  static getAllUserConfirm = {
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
  }
}
