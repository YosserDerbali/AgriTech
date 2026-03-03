const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const { authenticate } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/roles");

// router.use(authenticate, requireAdmin);

// Users management
router.get("/users",authenticate,requireAdmin, adminController.getAllUsers);
router.post("/users", authenticate,requireAdmin,adminController.createUser);
router.patch("/users/:userId", authenticate,requireAdmin,adminController.updateUserDetails);
router.patch("/users/:userId/role", authenticate,requireAdmin,adminController.updateUserRole);
router.patch("/users/:userId/status", authenticate,requireAdmin,adminController.updateUserStatus);
router.delete("/users/:userId",authenticate,requireAdmin, adminController.deleteUser);


module.exports = router;
