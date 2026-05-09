# 🧭 OVERALL ARCHITECTURE FLOW

Luồng hệ thống sẽ theo kiến trúc chuẩn:



## 🔐 OTP Flow

### Register
- tạo user (chưa active)
- generate OTP
- gửi email

### Verify OTP
- kiểm tra OTP
- kích hoạt tài khoản

---

# 📦 FEATURE BREAKDOWN

Bạn có 2 API chính:

## 1. Đăng ký tài khoản
- **Endpoint:** `/auth/register`
- **Mục tiêu:** tạo user + gửi OTP email

## 2. Xác thực OTP
- **Endpoint:** `/auth/verify-otp`
- **Mục tiêu:** kích hoạt tài khoản

---

# 🏗️ FOLDER STRUCTURE (UPDATED NAMING)


src/
├── routes/
│ └── authRoutes.js
├── controllers/
│ └── authController.js
├── services/
│ ├── authService.js
│ ├── otpService.js
│ └── emailService.js
├── middleware/
│ ├── rateLimiter.js
│ └── validator.js
├── utils/
│ ├── generateOtp.js
│ └── hashPassword.js


---

# 🚀 IMPLEMENTATION PLAN (NO CODE)

---

## 1️⃣ ROUTES LAYER (`authRoutes.js`)

### 🎯 Vai trò:
- Định nghĩa API endpoints
- Gắn middleware theo thứ tự đúng

### 🔁 Luồng:

#### Register route:
- rate limiter đăng ký
- validate input register
- gọi controller register

#### Verify OTP route:
- rate limiter OTP
- validate OTP input
- gọi controller verify

---

## 2️⃣ CONTROLLER LAYER (`authController`)

### 🎯 Vai trò:
- Nhận request từ route
- Không xử lý logic nghiệp vụ
- Gọi service tương ứng
- Trả response cho client

### 🔁 Nhiệm vụ:
- register → gọi `authService.registerUser`
- verifyOtp → gọi `authService.verifyOtp`

---

## 3️⃣ SERVICE LAYER (CORE LOGIC)

## 🔐 authService (quan trọng nhất)

### Register flow:
- kiểm tra email đã tồn tại chưa
- hash password
- tạo OTP
- tạo user trong MongoDB (`isVerified = false`)
- lưu OTP + expiry
- gọi emailService gửi OTP

### Verify OTP flow:
- tìm user theo email
- kiểm tra đã verify chưa
- so sánh OTP + kiểm tra hết hạn
- nếu đúng:
  - set `isVerified = true`
  - xoá OTP
  - lưu DB

---

## 🔐 otpService
- tạo OTP random
- xử lý thời gian hết hạn
- hỗ trợ mở rộng resend OTP sau này

---

## 📧 emailService
- gửi OTP qua MailHog
- format email đơn giản (subject + OTP code)

---

## 4️⃣ MIDDLEWARE LAYER

## 🚦 rateLimiter.js

### Register rate limit:
- giới hạn số lần đăng ký theo IP
- chống spam tạo account

### OTP rate limit:
- giới hạn số lần nhập OTP
- chống brute-force OTP

---

## ✅ validator.js

### Register validator:
- username không rỗng
- email đúng format
- password đủ mạnh

### OTP validator:
- email không rỗng
- OTP hợp lệ (6 số)

---

## 5️⃣ UTILS LAYER

### 🔢 generateOtp
- sinh mã OTP 6 chữ số

### 🔐 hashPassword
- hash password trước khi lưu DB

---

# 🗄️ DATABASE DESIGN (USER MODEL)

Chỉ cần đảm bảo:

- `isVerified: false` khi tạo user
- `otp` gồm:
  - `code`
  - `expiresAt`

---

# 📬 MAIL SYSTEM (MAILHOG)

- chạy bằng Docker Compose
- dùng để test email nội bộ
- không cần SMTP thật

---

# 🔥 END-TO-END FLOW TÓM TẮT

## 🧾 Register Flow:

1. Client gửi thông tin đăng ký
2. Rate limiter kiểm tra spam
3. Validator kiểm tra input
4. Controller gọi service
5. Service:
   - check email
   - hash password
   - tạo OTP
   - lưu user (inactive)
   - gửi email OTP

---

## 🔐 Verify OTP Flow:

1. Client gửi OTP + email
2. Rate limiter kiểm tra brute-force
3. Validator check input
4. Controller gọi service
5. Service:
   - check OTP đúng + chưa hết hạn
   - activate user
   - xoá OTP