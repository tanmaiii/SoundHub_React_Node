import Joi from "joi";

export const signup = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().max(255).empty().required(),
    password: Joi.string()
      .min(6)
      .max(50)
      // .pattern(
      //   new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{3,30}$")
      // )
      .required(),
    name: Joi.string().empty().max(50).required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ conflictError: error.details[0].message });
  }

  // Nếu dữ liệu hợp lệ, gán giá trị đã được xác thực vào req.body và chuyển sang middleware tiếp theo
  req.body = value;

  next();
};

export const signin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().max(255).empty().required(),
    password: Joi.string()
      .min(6)
      .max(50)
      // .pattern(
      //   new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{3,30}$")
      // )
      .required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ conflictError: error.details[0].message });
  }

  // Nếu dữ liệu hợp lệ, gán giá trị đã được xác thực vào req.body và chuyển sang middleware tiếp theo
  req.body = value;

  next();
};

export default {
  signup,
  signin,
};
