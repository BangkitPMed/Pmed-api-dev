const Joi = require('joi');

const RegisterUserPayload = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
  gender: Joi.string().required(),
  age: Joi.number().required(),
});

const LoginUserPayload = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {
  RegisterUserPayload,
  LoginUserPayload,
};
