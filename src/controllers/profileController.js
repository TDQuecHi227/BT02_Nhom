const userProfile = (req, res) => {
  return res.status(200).json({ message: "This is user profile" });
};
const adminProfile = (req, res) => {
  res.send("This is admin profile");
};

module.exports = {
  userProfile,
  adminProfile,
};
