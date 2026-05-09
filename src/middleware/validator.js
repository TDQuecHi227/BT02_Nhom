const validateLogin = (req, res, next) => {
  const { identifier, password } = req.body;

  // Kiểm tra dữ liệu bị trống
  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: "Dữ liệu bị trống hoặc sai định dạng." });
  }
  next();
};

// Validator: Quên mật khẩu
const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Email không hợp lệ." });
  }
  next();
};


// Validator: Xác nhận OTP
const validateVerifyOtp = (req, res, next) => {
  const { email, otp } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const otpRegex = /^\d{6}$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Email không hợp lệ." });
  }
  if (!otp || !otpRegex.test(otp)) {
    return res.status(400).json({ message: "OTP phải là 6 chữ số." });
  }
  next();
};

// ─────────────────────────────────────────────
// Validator: Đặt lại mật khẩu (bước 3)
// ─────────────────────────────────────────────
const validateResetPassword = (req, res, next) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken) {
    return res.status(400).json({ message: "Thiếu token xác thực." });
  }
  if (!newPassword || newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự." });
  }
  next();
};

module.exports = {
  validateLogin,
  validateForgotPassword,
  validateVerifyOtp,
  validateResetPassword,
};
