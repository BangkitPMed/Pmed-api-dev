const Joi = require('joi');

const RequestOtpPayload = Joi.object({
  token: Joi.string().required(),
});

const VerifyOtpPayload = Joi.object({
  otp: Joi.number().required(),
  token: Joi.string().required(),
});

const PostAuthenticationPayloadModel = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const PutAuthenticationPayloadModel = Joi.object({
  refreshToken: Joi.string().required(),
});

const DeleteAuthenticationPayloadModel = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  RequestOtpPayload,
  VerifyOtpPayload,
  PostAuthenticationPayloadModel,
  PutAuthenticationPayloadModel,
  DeleteAuthenticationPayloadModel,
};
