const authService = require("../services/authService");

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Gọi Service xử lý logic
    const authResult = await authService.loginUser(identifier, password);

    // Set Cookie cho JWT (Bảo mật: httpOnly tránh tấn công XSS)
    res.cookie("jwt", authResult.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Chỉ dùng https ở production
      maxAge: 15 * 60 * 1000, // 15 phút
    });

    res.cookie("refreshToken", authResult.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    // Xác thực thành công: 200 OK + redirect_url
    return res.status(200).json({
      message: "Đăng nhập thành công",
      redirect_url: authResult.redirect_url,
    });
  } catch (error) {
    // Bắt lỗi từ Service trả về
    if (error.message === "UNAUTHORIZED") {
      return res
        .status(401)
        .json({ message: "Không tìm thấy người dùng hoặc sai mật khẩu." });
    }

    console.error(error);
    return res.status(500).json({ message: "Lỗi server nội bộ." });
  }
};

// ─────────────────────────────────────────────
// FORGOT PASSWORD — Bước 1: Gửi OTP
// ─────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);

    return res.status(200).json({
      message: "Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.",
    });
  } catch (error) {
    if (error.message === "EMAIL_NOT_FOUND") {
      return res.status(404).json({ message: "Email không tồn tại trong hệ thống." });
    }

    console.error(error);
    return res.status(500).json({ message: "Lỗi server nội bộ." });
  }
};

// VERIFY OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyOtp(email, otp);

    return res.status(200).json({
      message: "OTP hợp lệ. Bạn có thể đặt lại mật khẩu.",
      resetToken: result.resetToken,
    });
  } catch (error) {
    if (error.message === "OTP_EXPIRED") {
      return res.status(400).json({ message: "Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới." });
    }
    if (error.message === "INVALID_OTP") {
      return res.status(400).json({ message: "Mã OTP không chính xác." });
    }

    console.error(error);
    return res.status(500).json({ message: "Lỗi server nội bộ." });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    await authService.resetPassword(resetToken, newPassword);

    return res.status(200).json({ message: "Mật khẩu đã được đặt lại thành công." });
  } catch (error) {
    if (error.message === "INVALID_TOKEN") {
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    console.error(error);
    return res.status(500).json({ message: "Lỗi server nội bộ." });
  }
};

module.exports = {
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
