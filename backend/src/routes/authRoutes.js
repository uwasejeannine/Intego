const express = require("express");
const router = express.Router();
const authController = require("../controllers/validations/authContoller");

// Login
router.post("/login", authController.login);

// Forgot Password
router.put("/forgot-password", authController.forgotPassword);

// Update Password

router.post("/logout", authController.logout);

router.post("/validate-code", authController.validateCode);

module.exports = router;
