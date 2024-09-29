import Joi from "joi";

const bodySchema = {
  body: Joi.object().keys({
    content: Joi.string().min(1).max(255).required(),
  }),
};

const querySchema = {
  query: Joi.object().keys({
    q: Joi.string().allow(null, "").optional(),
    sortBy: Joi.string().valid("old", "new", "popular").default("new"),
    limit: Joi.number().integer().required(),
    page: Joi.number().integer().required(),
  }),
};

export default class commentValidation {
  static createComment = {
    ...bodySchema,
    params: Joi.object().keys({
      songId: Joi.string().min(0).max(36).required(),
    }),
  };
  static getAllCommentsBySongId = {
    ...querySchema,
    params: Joi.object().keys({
      songId: Joi.string().min(0).max(36).required(),
    }),
  };
  static likeComment = {
    params: Joi.object().keys({
      commentId: Joi.string().min(0).max(36).required(),
    }),
  };
  static unLikeComment = {
    params: Joi.object().keys({
      commentId: Joi.string().min(0).max(36).required(),
    }),
  };
}
