const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Nếu không có googleId thì bắt buộc phải có password
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Cho phép nhiều bản ghi có giá trị null (dành cho người đăng ký thường)
    },

    // Phần dành cho Edit Profile
    profile: {
      fullName: { type: String, default: "" },
      avatarUrl: { type: String, default: "default-avatar.png" },
      bio: { type: String, default: "" },
      phoneNumber: { type: String, default: "" },
    },

    // Phần dành cho Đăng ký & Quên mật khẩu qua OTP
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      code: { type: String },
      expiresAt: { type: Date },
    },
    // Thêm vào bên trong userSchema
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
