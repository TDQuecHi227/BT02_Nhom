const authService = require("../services/authService");

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const authResult = await authService.loginUser(identifier, password);

    res.cookie("jwt", authResult.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", authResult.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Đăng nhập thành công",
      redirect_url: authResult.redirect_url,
    });
  } catch (error) {
    if (error.message === "UNAUTHORIZED") {
      return res
        .status(401)
        .json({ message: "Không tìm thấy người dùng hoặc sai mật khẩu." });
    }
    if (error.message === "ACCOUNT_NOT_VERIFIED") {
      return res
        .status(403)
        .json({ message: "Tài khoản chưa được kích hoạt. Vui lòng xác thực OTP." });
    }

    console.error(error);
    return res.status(500).json({ message: "Lỗi server nội bộ." });
  }
};

const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    if (error.message === "USER_ALREADY_EXISTS") {
      return res.status(400).json({ message: "Email hoặc Username đã tồn tại." });
    }
    console.error(error);
    return res.status(500).json({ message: "Lỗi server nội bộ." });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otpCode } = req.body;
    const result = await authService.verifyOtp(email, otpCode);
    return res.status(200).json(result);
  } catch (error) {
    const errorMessages = {
      USER_NOT_FOUND: "Không tìm thấy người dùng.",
      ALREADY_VERIFIED: "Tài khoản đã được xác thực trước đó.",
      INVALID_OTP: "Mã OTP không chính xác.",
      OTP_EXPIRED: "Mã OTP đã hết hạn.",
    };

    if (errorMessages[error.message]) {
      return res.status(400).json({ message: errorMessages[error.message] });
    }

    console.error(error);
    return res.status(500).json({ message: "Lỗi server nội bộ." });
  }
};

module.exports = {
  login,
  register,
  verifyOtp,
};

