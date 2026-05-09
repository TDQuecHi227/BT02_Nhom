const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const hashPassword = require("../utils/hashPassword");
const otpService = require("./otpService");
const emailService = require("./emailService");

const loginUser = async (identifier, password) => {
  // ... (existing loginUser logic)
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  // Check if verified
  if (!user.isVerified) {
    throw new Error("ACCOUNT_NOT_VERIFIED");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("UNAUTHORIZED");
  }

  const payload = { id: user._id, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  let redirect_url = "/user/profile";
  if (user.role === "admin") {
    redirect_url = "/admin/profile";
  }

  return { accessToken, refreshToken, redirect_url };
};

const registerUser = async (userData) => {
  const { username, email, password } = userData;

  // Check if user exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new Error("USER_ALREADY_EXISTS");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Generate OTP
  const { code, expiresAt } = otpService.createOtp();

  // Create user
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    isVerified: false,
    otp: { code, expiresAt },
  });

  await newUser.save();

  // Send Email
  await emailService.sendOtpEmail(email, code);

  return { message: "Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP." };
};

const verifyOtp = async (email, otpCode) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.isVerified) {
    throw new Error("ALREADY_VERIFIED");
  }

  // Check OTP
  if (!user.otp || user.otp.code !== otpCode) {
    throw new Error("INVALID_OTP");
  }

  // Check Expiry
  if (new Date() > user.otp.expiresAt) {
    throw new Error("OTP_EXPIRED");
  }

  // Verify User
  user.isVerified = true;
  user.otp = undefined; // Clear OTP
  await user.save();

  return { message: "Xác thực tài khoản thành công!" };
};

module.exports = {
  loginUser,
  registerUser,
  verifyOtp,
};

