const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

module.exports = {
  loginUser,
};
