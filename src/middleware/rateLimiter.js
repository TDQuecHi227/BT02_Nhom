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

module.exports = { loginLimiter };
