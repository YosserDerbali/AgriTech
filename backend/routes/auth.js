const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

// Register (mobile: farmer or agronomist)
router.post("/register", authController.register);

// Login (mobile & web)
router.post("/login", authController.login);

// Google Sign-In (Firebase OAuth)
router.post("/google-signin", authController.googleSignIn);

// Admin-only login (optional separate route)
router.post("/admin/login", authController.adminLogin);

module.exports = router;
