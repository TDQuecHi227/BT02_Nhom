const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "localhost",
  port: process.env.MAIL_PORT || 1025,
  ignoreTLS: true,
});

const sendOtpEmail = async (email, otpCode) => {
  const mailOptions = {
    from: '"Auth System" <no-reply@example.com>',
    to: email,
    subject: "Your Registration OTP",
    text: `Your OTP for registration is: ${otpCode}. It will expire in 10 minutes.`,
    html: `<p>Your OTP for registration is: <b>${otpCode}</b>.</p><p>It will expire in 10 minutes.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("EMAIL_SEND_FAILED");
  }
};

module.exports = { sendOtpEmail };
