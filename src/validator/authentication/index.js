const {
  RequestOtpPayload,
  VerifyOtpPayload,
  PostAuthenticationPayloadModel,
  PutAuthenticationPayloadModel,
  DeleteAuthenticationPayloadModel,
} = require('./models');
const InvariantError = require('../../exceptions/InvariantError');

const AuthenticationValidator = {

  validateRequestOtp: (payload) => {
    const validationResult = RequestOtpPayload.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateVerifyOtp: (payload) => {
    const validationResult = VerifyOtpPayload.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePostAuthenticationsPayload: (payload) => {
    const validationResult = PostAuthenticationPayloadModel.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutAuthenticationsPayload: (payload) => {
    const validationResult = PutAuthenticationPayloadModel.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteAuthenticationsPayload: (payload) => {
    const validationResult = DeleteAuthenticationPayloadModel.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationValidator;
