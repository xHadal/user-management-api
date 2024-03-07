// src/routes/userRoutes.js
const express = require("express");
const UserController = require("../controllers/UserController");
const Cache = require("../middlewares/Cache");

class UserRoutes {
  constructor() {
    this.router = express.Router();
    this.cache = Cache.getInstance();
    this.userController = UserController.getInstance(global.pool);
  }

  static getInstance() {
    if (!UserRoutes.instance) {
      UserRoutes.instance = new UserRoutes();
    }
    return UserRoutes.instance;
  }

  getUsersRouter() {
    //Routes
    this.router.get(
      "/",
      this.cache.get("users"),
      this.userController.getAllUsers.bind(this.userController)
    );
    this.router.get(
      "/:userId",
      this.cache.get("users"),
      this.userController.getUser.bind(this.userController)
    );
    this.router.post(
      "/",
      this.userController.createUser.bind(this.userController)
    );
    this.router.delete(
      "/:userId",
      this.userController.deleteUser.bind(this.userController)
    );
    this.router.put(
      "/:userId",
      this.userController.updateUser.bind(this.userController)
    );
    return this.router;
  }
}

module.exports = UserRoutes;
