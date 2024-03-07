// src/models/userModel.js
const { v4: uuidv4 } = require("uuid");

class UserModel {
  constructor() {
    this.pool = global.pool;
  }

  static getInstance() {
    if (!UserModel.instance) {
      UserModel.instance = new UserModel();
    }
    return UserModel.instance;
  }

  async getAllUsers() {
    const client = await this.pool.connect();
    try {
      const result = await client.query("SELECT * FROM users");
      return result.rows;
    } finally {
      client.release();
    }
  }

  async getUser(userId) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM users WHERE id=${userId}`
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  async createUser(
    id = uuidv4(),
    firstName,
    lastName,
    email,
    password,
    signedUpAt,
    role
  ) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO users (id, "firstName", "lastName", "email", password, "signedUpAt", role ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [id, firstName, lastName, email, password, signedUpAt, role]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
  }

  async updateUser(userId, name, email, password) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
        [name, email, password, userId]
      );

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async deleteUser(userId) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`DELETE FROM users WHERE id=${userId}`);
      return result.rows;
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = UserModel;
