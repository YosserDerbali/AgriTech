const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

// Register (mobile: farmer or agronomist)
router.post("/register", authController.register);

// Login (mobile & web)
router.post("/login", authController.login);

// Admin-only login (optional separate route)
router.post("/admin/login", authController.adminLogin);

module.exports = router;
