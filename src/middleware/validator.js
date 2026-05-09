const validateLogin = (req, res, next) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: "Dữ liệu bị trống hoặc sai định dạng." });
  }
  next();
};

const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin." });
  }

  // Simple email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Email không hợp lệ." });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Mật khẩu phải có ít nhất 6 ký tự." });
  }

  next();
};

const validateOtp = (req, res, next) => {
  const { email, otpCode } = req.body;

  if (!email || !otpCode) {
    return res
      .status(400)
      .json({ message: "Email và mã OTP không được để trống." });
  }

  if (otpCode.length !== 6) {
    return res.status(400).json({ message: "Mã OTP phải có 6 chữ số." });
  }

  next();
};

module.exports = { validateLogin, validateRegister, validateOtp };

