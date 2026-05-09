const User = require("../models/userModel");

const profileFields = ["fullName", "avatarUrl", "bio", "phoneNumber"];

const normalizeProfilePayload = (payload) => {
  return profileFields.reduce((accumulator, field) => {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      const value = payload[field];
      accumulator[field] = typeof value === "string" ? value.trim() : value;
    }

    return accumulator;
  }, {});
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select(
    "username email role profile createdAt updatedAt",
  );

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
};

const updateUserProfile = async (userId, payload) => {
  const profileData = normalizeProfilePayload(payload);

  if (Object.keys(profileData).length === 0) {
    throw new Error("NO_PROFILE_DATA");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { profile: profileData } },
    { new: true, runValidators: true },
  ).select("username email role profile createdAt updatedAt");

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};