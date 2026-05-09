const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: (req, res) => {
    res
      .status(429)
      .json({ message: "Vượt quá giới hạn truy cập. Vui lòng thử lại sau." });
  },
});

// Giới hạn request gửi OTP (tránh spam email)
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).json({
      message: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút.",
    });
  },
});

module.exports = { loginLimiter, forgotPasswordLimiter };
