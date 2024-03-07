// src/controllers/UserController.js
const UserModel = require("../models/UserModel");
const Cache = require("../middlewares/Cache");

class UserController {
  constructor() {
    this.userModel = UserModel.getInstance(global.pool);
    this.cache = Cache.getInstance();
  }

  static getInstance() {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }

  // GET all Users
  async getAllUsers(req, res) {
    try {
      const users = await this.userModel.getAllUsers();
      await this.cache.set("users", JSON.stringify(users), 3600);
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ "Internal Server Error:": error });
    }
  }

  // GET User by ID
  async getUser(req, res) {
    try {
      const { userId } = req.params;
      const users = await this.userModel.getUser(userId);
      await this.cache.set(`users${userId}`, JSON.stringify(users), 3600);
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ "Internal Server Error:": error });
    }
  }

  // CREATE
  async createUser(req, res) {
    const {
      id,
      firstName,
      lastName,
      email,
      password,
      signedUpAt = new Date(),
      role = "user",
    } = req.body;
    try {
      const newUser = await this.userModel.createUser(
        id,
        firstName,
        lastName,
        email,
        password,
        signedUpAt,
        role
      );
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ "Internal Server Error:": error });
    }
  }

  // UPDATE
  async updateUser(req, res) {
    const userId = req.params.id;
    const { name, email, password } = req.body;
    try {
      const updatedUser = await this.userModel.updateUser(
        userId,
        name,
        email,
        password
      );
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(error.response.status).json(error.response.data);
    }
  }

  // DELETE
  async deleteUser(req, res) {
    const { userId } = req.params;
    try {
      const deletedUser = await this.userModel.deleteUser(userId);
      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ "Internal Server Error:": error });
    }
  }
}

module.exports = UserController;
