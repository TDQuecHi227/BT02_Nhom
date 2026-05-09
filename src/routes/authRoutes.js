const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginLimiter, forgotPasswordLimiter } = require("../middleware/rateLimiter");
const {
  validateLogin,
  validateForgotPassword,
  validateVerifyOtp,
  validateResetPassword,
} = require("../middleware/validator");

// POST /api/auth/login
// Thứ tự thực thi: Rate Limiter -> Validator -> Controller
const initAuthRoute = (app) => {
  // router.get("/login", authController.getLogin);
  router.post("/login", loginLimiter, validateLogin, authController.login);

  // POST /api/auth/forgot-password
  router.post(
    "/forgot-password",
    forgotPasswordLimiter,
    validateForgotPassword,
    authController.forgotPassword,
  );

  // POST /api/auth/verify-otp
  router.post(
    "/verify-otp",
    validateVerifyOtp,
    authController.verifyOtp,
  );

  // POST /api/auth/reset-password — Bước 3: Đặt lại mật khẩu
  router.post(
    "/reset-password",
    validateResetPassword,
    authController.resetPassword,
  );

  return app.use("/api/auth", router);
};

module.exports = initAuthRoute;
