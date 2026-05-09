const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendOtpEmail } = require("../config/mailer");

const loginUser = async (identifier, password) => {
  // 1. Tìm người dùng trong Database (findUser)
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  // 2. Không tìm thấy người dùng
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  // 3. Kiểm tra mật khẩu
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("UNAUTHORIZED");
  }

  // 4. Tạo JWT (Access Token & Refresh Token)
  const payload = { id: user._id, role: user.role };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  // Lưu ý: Nên có REFRESH_SECRET riêng trong file .env
  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  // 5. Xác định redirect_url dựa trên role
  let redirect_url = "/user/profile";
  if (user.role === "admin") {
    redirect_url = "/admin/profile";
  }

  // Trả dữ liệu về cho Controller
  return { accessToken, refreshToken, redirect_url };
};


// FORGOT PASSWORD — Gửi OTP về email
const forgotPassword = async (email) => {
  //Tìm user theo email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("EMAIL_NOT_FOUND");
  }

  //Sinh OTP 6 chữ số ngẫu nhiên
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash OTP trước khi lưu vào DB (bảo mật)
  const hashedOtp = await bcrypt.hash(otpCode, 10);

  //Lưu OTP vào DB, hết hạn sau 10 phút
  user.otp = {
    code: hashedOtp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  };
  await user.save();

  // Gửi email chứa OTP thật (chưa hash) đến người dùng
  await sendOtpEmail(email, otpCode);
};

// VERIFY OTP
const verifyOtp = async (email, otp) => {
  //Tìm user
  const user = await User.findOne({ email });
  if (!user || !user.otp || !user.otp.code) {
    throw new Error("INVALID_OTP");
  }

  //Kiểm tra OTP còn hiệu lực chưa
  if (new Date() > user.otp.expiresAt) {
    throw new Error("OTP_EXPIRED");
  }

  // So sánh OTP người dùng nhập với hash trong DB
  const isMatch = await bcrypt.compare(otp, user.otp.code);
  if (!isMatch) {
    throw new Error("INVALID_OTP");
  }

  // OTP hợp lệ -> cấp resetToken JWT (10 phút)
  const resetToken = jwt.sign(
    { id: user._id, purpose: "reset_password" },
    process.env.JWT_SECRET,
    { expiresIn: "10m" },
  );

  return { resetToken };
};


// RESET PASSWORD
const resetPassword = async (resetToken, newPassword) => {
  // Verify resetToken
  let decoded;
  try {
    decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
  } catch {
    throw new Error("INVALID_TOKEN");
  }

  //  Kiểm tra purpose đúng
  if (decoded.purpose !== "reset_password") {
    throw new Error("INVALID_TOKEN");
  }

  // Tìm user
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  //  Hash mật khẩu mới và lưu
  user.password = await bcrypt.hash(newPassword, 10);

  //  Xóa OTP khỏi DB (dùng 1 lần)
  user.otp = undefined;

  await user.save();
};

module.exports = {
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
