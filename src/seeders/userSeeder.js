const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/userModel");
const connectDB = require("../config/configdb");

const seedUsers = async () => {
  try {
    // Kết nối vào Database
    await connectDB();

    // Xóa toàn bộ user cũ (nếu muốn làm sạch DB trước khi seed)
    // Lưu ý: Chỉ dùng trong môi trường dev/test
    await User.deleteMany();
    console.log("🗑️ Đã xóa dữ liệu User cũ.");

    // Mã hóa chung 1 mật khẩu cho dễ test
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    const usersData = [
      {
        username: "admin_master",
        email: "admin@flashcard.com",
        password: hashedPassword,
        role: "admin",
        isVerified: true,
        profile: {
          fullName: "Quản Trị Viên",
          bio: "System Administrator",
          phoneNumber: "0123456789",
        },
      },
      {
        username: "thangnguyen",
        email: "thang@example.com",
        password: hashedPassword,
        role: "user",
        isVerified: true, // Đã xác thực OTP
        profile: {
          fullName: "Nguyễn Văn Thắng",
          bio: "Học sinh lớp 12, mục tiêu IELTS 7.0",
        },
      },
    ];

    // Đẩy dữ liệu vào DB
    await User.insertMany(usersData);
    console.log("✅ Đã tạo thành công dữ liệu mẫu cho Users!");

    // Đóng kết nối và thoát script
    mongoose.connection.close();
    process.exit();
  } catch (error) {
    console.error("❌ Lỗi khi seed dữ liệu:", error);
    process.exit(1);
  }
};

seedUsers();
