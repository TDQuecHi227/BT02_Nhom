const jwt = require("jsonwebtoken");

// 1. Middleware Xác thực (Kiểm tra Token)
const verifyToken = (req, res, next) => {
  // Lấy token từ cookie (nhờ cookie-parser đã cấu hình ở main.js)
  const token = req.cookies.jwt;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Bạn chưa đăng nhập hoặc phiên làm việc đã kết thúc." });
  }

  try {
    // Giải mã token bằng Secret Key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lưu thông tin giải mã (id, role) vào đối tượng req để các route sau sử dụng
    req.user = decoded;

    next(); // Cho phép đi tiếp
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn." });
  }
};

// 2. Middleware Phân quyền (Kiểm tra Role)
// Sử dụng rest parameter (...allowedRoles) để truyền vào 1 hoặc nhiều role
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Chắc chắn rằng verifyToken đã chạy trước đó và gán req.user
    if (!req.user) {
      return res.status(401).json({ message: "Lỗi xác thực người dùng." });
    }

    // Kiểm tra xem role của user hiện tại có nằm trong danh sách cho phép không
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: Bạn không có quyền truy cập tài nguyên này.",
      });
    }

    next(); // Có quyền -> Cho phép đi tiếp
  };
};

module.exports = {
  verifyToken,
  authorizeRole,
};
