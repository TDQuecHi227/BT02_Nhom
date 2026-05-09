POSTMAN TEST CASES – AUTH OTP SYSTEM
🟢 1. REGISTER API
🔹 1.1 Register success
Method: POST
URL:
http://localhost:8081/api/auth/register
Body:
{
  "username": "kietnguyen",
  "email": "kiet@example.com",
  "password": "123456"
}
Expected:
201 / 200 OK
Message: OTP sent to email
🔴 1.2 Register duplicate email
Body:
{
  "username": "kiet2",
  "email": "kiet@example.com",
  "password": "123456"
}
Expected:
409 Conflict
Email already exists
🔴 1.3 Register invalid email
Body:
{
  "username": "kiet",
  "email": "kiet-email",
  "password": "123456"
}
Expected:
400 Bad Request
🔴 1.4 Register weak password
Body:
{
  "username": "kiet",
  "email": "kiet2@example.com",
  "password": "123"
}
Expected:
400 Bad Request
🔴 1.5 Register rate limit test

👉 Gửi nhanh 6–10 request liên tục

Expected:
429 Too Many Requests
📬 CHECK MAILHOG (QUAN TRỌNG)
http://localhost:8025

👉 Sau register success:

sẽ có email OTP
copy OTP để test verify
🟡 2. VERIFY OTP API
🔹 2.1 Verify OTP success
Method: POST
URL:
http://localhost:8081/api/auth/verify-otp
Body:
{
  "email": "kiet@example.com",
  "otpCode": "123456"
}
Expected:
200 OK
Account verified successfully
🔴 2.2 Wrong OTP
{
  "email": "kiet@example.com",
  "otpCode": "000000"
}
Expected:
400 Bad Request
Invalid OTP
🔴 2.3 Expired OTP

👉 đợi > 5 phút rồi verify

Expected:
400 Bad Request
OTP expired
🔴 2.4 OTP already used

👉 verify lần 2

Expected:
400 Bad Request
Already verified
🔴 2.5 Missing OTP fields
{
  "email": ""
}
Expected:
400 Bad Request
🔴 2.6 OTP brute force test

👉 nhập sai OTP liên tục

Expected:
429 Too Many Requests (if rate limit enabled)
🔵 3. LOGIN API
🔹 3.1 Login success
Method: POST
URL:
http://localhost:8081/api/auth/login
Body:
{
  "identifier": "kiet@example.com",
  "password": "123456"
}
Expected:
200 OK
JWT token hoặc cookie
🔴 3.2 Login chưa verify OTP
Expected:
403 Forbidden
Account not verified
🔴 3.3 Wrong password
{
  "identifier": "kiet@example.com",
  "password": "wrongpass"
}
Expected:
401 Unauthorized
🔴 3.4 User not found
{
  "identifier": "unknown@example.com",
  "password": "123456"
}
Expected:
404 Not Found
🧪 4. EDGE TEST CASES
🔹 4.1 Empty body
Expect: 400
🔹 4.2 SQL/NoSQL injection test
{
  "email": "' OR 1=1 --",
  "password": "123"
}
Expect: rejected by validation
🔹 4.3 Invalid JSON
Expect: 400 / parser error