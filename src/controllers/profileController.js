const profileService = require("../services/profileService");

const buildProfileResponse = (user) => ({
  userId: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  profile: user.profile,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const getProfile = async (req, res) => {
  try {
    const user = await profileService.getUserProfile(req.user.id);

    return res.status(200).json({
      message: "Lấy thông tin profile thành công",
      data: buildProfileResponse(user),
    });
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    console.error(error);
    return res.status(500).json({ message: "Lỗi server nội bộ." });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await profileService.updateUserProfile(req.user.id, req.body);

    return res.status(200).json({
      message: "Cập nhật profile thành công",
      data: buildProfileResponse(user),
    });
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    if (error.message === "NO_PROFILE_DATA") {
      return res.status(400).json({
        message: "Vui lòng cung cấp ít nhất một trường để cập nhật.",
      });
    }

    console.error(error);
    return res.status(500).json({ message: "Lỗi server nội bộ." });
  }
};

const userProfile = getProfile;
const adminProfile = getProfile;

module.exports = {
  userProfile,
  adminProfile,
  updateProfile,
};
