const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginLimiter } = require("../middleware/rateLimiter");
const { validateLogin } = require("../middleware/validator");

// POST /api/auth/login
// Thứ tự thực thi: Rate Limiter -> Validator -> Controller
const initAuthRoute = (app) => {
  router.get("/login", authController.getLogin);
  router.post("/login", loginLimiter, validateLogin, authController.login);
  return app.use("/api/auth", router);
};
module.exports = initAuthRoute;
