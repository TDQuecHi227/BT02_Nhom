const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");
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
  router.get(
    "/admin/profile",
    verifyToken,
    authorizeRole("admin"),
    profileController.adminProfile,
  );
  return app.use("/", router);
};
module.exports = initAPI;
