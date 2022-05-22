const { encrypt, decrypt } = require('../../RSA_encryption/Rsa');

class AuthenticationHandler {
  constructor({
    controllers, validator, mailSender, tokenManager,
  }) {
    this._validator = validator;
    this._controllers = controllers;
    this._mailSender = mailSender;
    this._tokenManager = tokenManager;

    this.requestOtpHandler = this.requestOtpHandler.bind(this);
    this.verifyOtpHanlder = this.verifyOtpHanlder.bind(this);
    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async requestOtpHandler(request) {
    await this._validator.validateRequestOtp(request.payload);

    const { token } = request.payload;

    const { username, email } = JSON.parse(decrypt(token));
    const otp = Math.floor(100000 + Math.random() * 900000);
    const partialEmail = email.replace(/(\w{3})[\w.-]+@([\w.]+\w)/, '$1***@$2');

    await this._controllers.addOtpToken(otp, token);
    await this._mailSender.sendEmail(email, username, otp);

    return {
      status: 'success',
      message: `successfully send otp to ${partialEmail}`,
    };
  }

  async verifyOtpHanlder(request) {
    await this._validator.validateVerifyOtp(request.payload);

    const { otp, token } = request.payload;
    const { id } = JSON.parse(decrypt(token));

    await this._controllers.verifyOtp(otp, token);
    await this._controllers.verifiedUserEmail(id);

    return {
      status: 'success',
      message: 'successfully verified email',
    };
  }

  async postAuthenticationHandler(request, h) {
    this._validator.validatePostAuthenticationsPayload(request.payload);
    const { email, password } = request.payload;

    const {
      id, username, userMail, isEmailVerified,
    } = await this._controllers.verifyUserCredential(email, password);

    if (isEmailVerified === false) {
      const token = encrypt({
        id,
        username,
        email: userMail,
      });

      const response = h.response({
        status: 'success',
        message: 'please verify your email address',
        data: {
          token,
        },
      });
      return response;
    }

    const accessToken = this._tokenManager.generateAccessToken({
      id,
      username,
      email: userMail,
    });

    const refreshToken = this._tokenManager.generateRefreshToken({
      id,
      username,
      email: userMail,
    });
    await this._controllers.addRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Successfully log-in',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request) {
    this._validator.validatePutAuthenticationsPayload(request.payload);

    const { refreshToken } = request.payload;

    await this._controllers.verifyRefreshToken(refreshToken);

    const { id, username, email } = this._tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this._tokenManager.generateAccessToken({ id, username, email });

    return {
      status: 'success',
      message: 'successfully update the token',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request) {
    this._validator.validateDeleteAuthenticationsPayload(request.payload);

    const { refreshToken } = request.payload;
    await this._controllers.verifyRefreshToken(refreshToken);
    await this._controllers.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'successfully deleted refresh token',
    };
  }
}

module.exports = AuthenticationHandler;
