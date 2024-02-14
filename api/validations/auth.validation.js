import Joi from "joi";

export const signup = {
	body: Joi.object().keys({
		email: Joi.string().email().required(),
		name: Joi.string().trim().min(2).max(66).required(),
		password: Joi.string().trim().min(6).max(666).required()
	})
};

export const signin = {
	body: Joi.object().keys({
        email: Joi.string().required(),
		password: Joi.string().required()
	})
};

export default {
    signup,
    signin
}