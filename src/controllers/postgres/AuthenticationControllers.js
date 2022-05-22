const { Pool } = require('pg');
const { compare } = require('bcrypt');

const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class AuthenticationControllers {
  constructor() {
    this._pool = new Pool();
  }

  async addOtpToken(otp, data) {
    const query = {
      text: 'INSERT INTO otp VALUES ($1, $2)',
      values: [otp, data],
    };

    await this._pool.query(query);
  }

  async verifyOtp(otp, token) {
    const query = {
      text: 'SELECT timestamp FROM otp WHERE token = $1 AND otp_num = $2',
      values: [token, otp],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('otp expired');
    }

    const { timestamp } = result.rows[0];
    const dateNow = Date.now();
    const otpTimestamp = new Date(timestamp);

    if ((dateNow - otpTimestamp) >= 5 * 60 * 1000) {
      throw new InvariantError('otp expired');
    }

    return result.rows[0];
  }

  async verifiedUserEmail(userId) {
    const query = {
      text: 'UPDATE users SET is_email_verified = true WHERE id = $1',
      values: [userId],
    };

    await this._pool.query(query);
  }

  async verifyUserCredential(email, password) {
    const lowerCaseMail = email.toLowerCase();
    const query = {
      text: 'SELECT id, email, username, is_email_verified, password FROM users WHERE email = $1',
      values: [lowerCaseMail],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthenticationError('Invalid username');
    }

    const {
      id, email: userMail, username, password: hashedPassword, is_email_verified: isEmailVerified,
    } = result.rows[0];

    const match = await compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Invalid password');
    }

    return {
      id, username, userMail, isEmailVerified,
    };
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT refresh_token FROM authentications WHERE refresh_token = $1',
      values: [token],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('invalid refresh token');
    }
  }

  async deleteRefreshToken(token) {
    await this.verifyRefreshToken(token);

    const query = {
      text: 'DELETE FROM authentications WHERE refresh_token = $1',
      values: [token],
    };
    await this._pool.query(query);
  }
}

module.exports = AuthenticationControllers;
