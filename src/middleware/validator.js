const validateLogin = (req, res, next) => {
  const { identifier, password } = req.body;

  // Kiểm tra dữ liệu bị trống
  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: "Dữ liệu bị trống hoặc sai định dạng." });
  }
  next();
};

const validateProfileUpdate = (req, res, next) => {
  const allowedFields = ["fullName", "avatarUrl", "bio", "phoneNumber"];
  const hasAllowedField = allowedFields.some((field) => {
    return Object.prototype.hasOwnProperty.call(req.body, field);
  });

  if (!hasAllowedField) {
    return res.status(400).json({
      message: "Vui lòng cung cấp ít nhất một trường profile hợp lệ.",
    });
  }

  next();
};

module.exports = { validateLogin, validateProfileUpdate };
