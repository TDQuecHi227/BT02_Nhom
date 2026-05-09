const generateOtp = require("../utils/generateOtp");

const createOtp = () => {
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return { code, expiresAt };
};

module.exports = { createOtp };
