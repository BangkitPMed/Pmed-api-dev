const { encrypt } = require('../../RSA_encryption/Rsa');

class UserHandler {
  constructor(controllers, validator) {
    this._validator = validator;
    this._controllers = controllers;

    this.registerUserHandler = this.registerUserHandler.bind(this);
    this.getUserProfileHanlder = this.getUserProfileHanlder.bind(this);
  }

  async registerUserHandler(request, h) {
    await this._validator.validateUserRegisterModel(request.payload);

    const {
      email, username, fullname, password, gender, age,
    } = request.payload;
    await this._controllers.verifyEmail(email);
    await this._controllers.verifyUsername(username);

    const userData = await this._controllers.registerUser({
      email, username, fullname, password, gender, age,
    });

    const hash = encrypt({
      id: userData.id,
      username: userData.username,
      email: userData.email,
    });

    const response = h.response({
      status: 'success',
      message: 'successfully registered user, please verify email to log in',
      statusCode: 201,
      data: {
        userId: userData.id,
        token: hash,
      },
    });
    response.code(201);
    return response;
  }

  async getUserProfileHanlder(request) {
    const { id } = request.auth.credentials;
    const profile = await this._controllers.getUserProfile(id);

    return {
      status: 'success',
      message: 'successfully get user information',
      data: {
        profile,
      },
    };
  }
}

module.exports = UserHandler;
