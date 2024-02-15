import Joi from "joi";

export const signup = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().max(255).empty().required().messages({
      "string.string": `Email phải là chữ`,
      "string.email": `Email không hợp lệ`,
      "string.empty": "Email không được bỏ trống",
      "string.max": `Trường này không quá 255 kí tự`,
      "any.required": `Email là trường bắt buộc`,
    }),
    password: Joi.string()
      .min(6)
      .max(255)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required()
      .messages({
        "string.string": `Password phải là chữ`,
        "string.base": `Password should be a type of 'text'`,
        "string.min": `Password ít nhất 6 kí tự`,
        "string.max": `Trường này không quá 255 kí tự`,
        "any.required": "Password là trường bắt buộc",
      }),
    name: Joi.string().empty().max(255).required().messages({
      "string.string": `Tên phải là chữ`,
      "string.empty": "Tên không được bỏ trống",
      "string.max": `Trường này không quá 255 kí tự`,
      "any.required": `Tên là trường bắt buộc`,
    }),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Nếu dữ liệu hợp lệ, gán giá trị đã được xác thực vào req.body và chuyển sang middleware tiếp theo
  req.body = value;

  next();
};

export const signin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().max(255).empty().required().messages({
      "string.string": `Email phải là chữ`,
      "string.email": `Email không hợp lệ`,
      "string.max": `Email không quá 255 kí tự`,
      "string.empty": "Email không được bỏ trống",
      "any.required": `Email là trường bắt buộc`,
    }),
    password: Joi.string()
      .min(6)
      .max(255)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required()
      .messages({
        "string.string": `Password phải là chữ`,
        "string.base": `Password should be a type of 'text'`,
        "string.min": `Password ít nhất 6 kí tự`,
        "string.min": `Password không quá 255 kí tự`,
        "any.required": "Password là trường bắt buộc",
      }),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Nếu dữ liệu hợp lệ, gán giá trị đã được xác thực vào req.body và chuyển sang middleware tiếp theo
  req.body = value;

  next();
};

export default {
  signup,
  signin,
};
