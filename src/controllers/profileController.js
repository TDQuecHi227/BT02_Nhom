const userProfile = (req, res) => {
  return res.status(200).json({
    message: "This is user profile",
    data: { userId: req.user.id, role: req.user.role },
  });
};
const adminProfile = (req, res) => {
  return res.status(200).json({
    message: "This is admin profile",
    data: { userId: req.user.id, role: req.user.role },
  });
};

module.exports = {
  userProfile,
  adminProfile,
};
