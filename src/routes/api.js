const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");
const { validateProfileUpdate } = require("../middleware/validator");
const profileController = require("../controllers/profileController");
const initAPI = (app) => {
  router.get("/", (req, res) => {
    return res.send("Homepage");
  });
  router.get(
    "/user/profile",
    verifyToken,
    authorizeRole("user"),
    profileController.userProfile,
  );
  router.put(
    "/user/profile",
    verifyToken,
    authorizeRole("user"),
    validateProfileUpdate,
    profileController.updateProfile,
  );
  router.get(
    "/admin/profile",
    verifyToken,
    authorizeRole("admin"),
    profileController.adminProfile,
  );
  router.put(
    "/admin/profile",
    verifyToken,
    authorizeRole("admin"),
    validateProfileUpdate,
    profileController.updateProfile,
  );
  return app.use("/", router);
};
module.exports = initAPI;
