const userProfile = (req, res) => {
  res.send("This is user profile");
};
const adminProfile = (req, res) => {
  res.send("This is admin profile");
};

module.exports = {
  userProfile,
  adminProfile,
};
