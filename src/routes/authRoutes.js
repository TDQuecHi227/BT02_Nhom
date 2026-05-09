const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginLimiter, registerLimiter, otpLimiter } = require("../middleware/rateLimiter");
const { validateLogin, validateRegister, validateOtp } = require("../middleware/validator");

const initAuthRoute = (app) => {
  router.post("/login", loginLimiter, validateLogin, authController.login);
  router.post("/register", registerLimiter, validateRegister, authController.register);
  router.post("/verify-otp", otpLimiter, validateOtp, authController.verifyOtp);
  
  return app.use("/api/auth", router);
};
module.exports = initAuthRoute;

