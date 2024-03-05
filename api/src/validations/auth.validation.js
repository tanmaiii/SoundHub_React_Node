import Joi from "joi";

export default class authValidation {
  static signup = {
    body: Joi.object().keys({
      email: Joi.string().email().max(255).empty().required(),
      password: Joi.string()
        .min(6)
        .max(50)
        // .pattern(
        //   new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{3,30}$")
        // )
        .required(),
      name: Joi.string().empty().max(50).required(),
    }),
  };
  static signin = {
    body: Joi.object().keys({
      email: Joi.string().email().max(255).empty().required(),
      password: Joi.string()
        .min(6)
        .max(50)
        // .pattern(
        //   new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{3,30}$")
        // )
        .required(),
    }),
  };
  static forgotPassword = {
    body: Joi.object().keys({
      email: Joi.string().email().max(255).empty().required(),
    }),
  };
  static resetPassword = {
    query: Joi.object().keys({
      token: Joi.string().required(),
    }),
    body: Joi.object().keys({
      password: Joi.string().email().max(255).empty().required(),
    }),
  };
  static sendVerificationEmail = {
    body: Joi.object().keys({
      email: Joi.string().email().max(255).empty().required(),
    }),
  };
  static verifyEmail = {
    query: Joi.object().keys({
      token: Joi.string().required(),
    }),
  };
}
