# Hướng dẫn test chức năng edit profile

Tài liệu này mô tả cách test luồng edit profile cho backend hiện tại.

## 1. Điều kiện trước khi test

- Server đang chạy bình thường.
- Có ít nhất một user hợp lệ trong MongoDB.
- Đã đăng nhập thành công để lấy cookie `jwt`.

## 2. Test login trước

Gửi request:

```http
POST /api/auth/login
Content-Type: application/json
```

Body ví dụ:

```json
{
  "identifier": "user1@example.com",
  "password": "123456"
}
```

Kết quả mong đợi:

- Trả `200`.
- Response có `message: "Đăng nhập thành công"`.
- Server set cookie `jwt` và `refreshToken`.

## 3. Test xem profile

Gửi request:

```http
GET /user/profile
```

Hoặc:

```http
GET /admin/profile
```

Yêu cầu:

- Request phải kèm cookie `jwt`.
- Role phải đúng với route đang gọi.

Kết quả mong đợi:

- Trả `200`.
- Response có `username`, `email`, `role`, `profile`.

## 4. Test edit profile

Gửi request:

```http
PUT /user/profile
Content-Type: application/json
```

Hoặc:

```http
PUT /admin/profile
Content-Type: application/json
```

Body hợp lệ ví dụ:

```json
{
  "fullName": "Nguyen Van A",
  "avatarUrl": "https://example.com/avatar.png",
  "bio": "Sinh vien CNTT",
  "phoneNumber": "0123456789"
}
```

Chỉ cần gửi ít nhất một field hợp lệ trong 4 field trên.

Kết quả mong đợi:

- Trả `200`.
- Message: `Cập nhật profile thành công`.
- `data.profile` phản ánh giá trị mới vừa cập nhật.

## 5. Các trường hợp lỗi cần test

### 5.1 Chưa đăng nhập

- Không gửi cookie `jwt`.
- Kết quả mong đợi: `401`.

### 5.2 Token sai hoặc hết hạn

- Gửi cookie `jwt` không hợp lệ.
- Kết quả mong đợi: `403`.

### 5.3 Sai role

- User thường gọi `/admin/profile` hoặc admin gọi `/user/profile`.
- Kết quả mong đợi: `403`.

### 5.4 Body rỗng khi update

```json
{}
```

Kết quả mong đợi:

- `400`
- Message báo cần cung cấp ít nhất một trường hợp lệ.

### 5.5 User không tồn tại trong DB

- Token hợp lệ nhưng user đã bị xoá.
- Kết quả mong đợi: `404`.

## 6. Luồng logic ngắn gọn

1. Request đi vào route profile.
2. `verifyToken` kiểm tra cookie `jwt`.
3. `authorizeRole` kiểm tra role.
4. `validateProfileUpdate` kiểm tra body update có field hợp lệ.
5. Controller gọi service để lấy hoặc cập nhật dữ liệu.
6. Service thao tác trực tiếp với MongoDB qua model `User`.
7. Controller trả response cuối cùng cho client.
