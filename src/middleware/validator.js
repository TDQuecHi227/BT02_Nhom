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

module.exports = { validateLogin };
