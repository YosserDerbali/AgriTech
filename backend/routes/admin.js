const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const { authenticate } = require("../middleware/auth.middleware");
const { requireAdmin } = require("../middleware/role.middleware");

// All routes are protected for ADMIN only
router.use(authenticate, requireAdmin);

router.get("/users", adminController.getAllUsers);
router.patch("/users/:userId/role", adminController.updateUserRole);
router.patch("/users/:userId/status", adminController.updateUserStatus);
router.delete("/users/:userId", adminController.deleteUser);

module.exports = router;
