const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const { authenticate } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/roles");

router.use(authenticate, requireAdmin);

// Users management
router.get("/users", adminController.getAllUsers);
router.post("/users", adminController.createUser);
router.patch("/users/:userId", adminController.updateUserDetails);
router.patch("/users/:userId/role", adminController.updateUserRole);
router.patch("/users/:userId/status", adminController.updateUserStatus);
router.delete("/users/:userId", adminController.deleteUser);


module.exports = router;
