const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { hash } = require('bcrypt');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserControllers {
  constructor() {
    this._pool = new Pool();
  }

  async registerUser({
    email, username, fullname, password, gender, age,
  }) {
    const userId = `user-${nanoid(10)}`;
    const hashPassword = await hash(password, 10);
    const lowerCaseMail = email.toLowerCase();

    const query = {
      text: 'INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, username, email',
      values: [userId, lowerCaseMail, username, fullname, gender, age, hashPassword],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('fail to register user');
    }

    return result.rows[0];
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError('Username already taken');
    }
  }

  async verifyEmail(email) {
    const lowerCaseMail = email.toLowerCase();
    const query = {
      text: 'SELECT email FROM users WHERE email = $1',
      values: [lowerCaseMail],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError('email already taken');
    }
  }

  async getUserProfile(id) {
    const query = {
      text: 'SELECT email, username, fullname, gender, age, created_at FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('user not found');
    }

    const {
      email, username, fullname, gender, age, created_at: createdAt,
    } = result.rows[0];

    return {
      email, username, fullname, gender, age, createdAt,
    };
  }
}

module.exports = UserControllers;
