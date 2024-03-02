import { query } from "express";
import Joi from "joi";

const bodySchema = {
  body: Joi.object().keys({
    email: Joi.string().email().max(255),
    password: Joi.string().min(6).max(255),
    name: Joi.string().min(6).max(255),
    image_path: Joi.string().min(10).max(255),
    verified: Joi.number().valid(0, 1),
    is_admin: Joi.number().valid(0, 1),
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
export default class userValidation {
  static getUser = {
    params: Joi.object().keys({
      userId: Joi.number().integer().required(),
    }),
  };
  static getMe = {
    ...cookieSchema,
  };
  static updateUser = {
    ...bodySchema,
    ...cookieSchema
  };
  static getAllUser = {
    ...querySchema,
  };
  static getFollowed = {
    ...querySchema,
    params: Joi.object().keys({
      userId: Joi.number().integer().required(),
    }),
  };
  static getFollower = {
    ...querySchema,
    params: Joi.object().keys({
      userId: Joi.number().integer().required(),
    }),
  };
  static addFollow = {
    ...cookieSchema,
    params: Joi.object().keys({
      userId: Joi.number().integer().required(),
    }),
  };
  static removeFollow = {
    ...cookieSchema,
    params: Joi.object().keys({
      userId: Joi.number().integer().required(),
    }),
  };
}
