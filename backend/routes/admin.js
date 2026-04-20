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

// RSS Configuration management
router.get("/rss-configurations", authenticate, requireAdmin, adminController.getAllRssConfigurations);
router.get("/rss-configurations/category/:category", authenticate, requireAdmin, adminController.getRssConfigurationsByCategory);
router.patch("/rss-configurations/:key", authenticate, requireAdmin, adminController.updateRssConfiguration);
router.post("/rss-configurations/validate-feed", authenticate, requireAdmin, adminController.validateRssFeed);
router.post("/rss-configurations/preview-sync", authenticate, requireAdmin, adminController.previewRssSync);
router.post("/rss-configurations/trigger-sync", authenticate, requireAdmin, adminController.triggerRssSync);
router.get("/rss-configurations/schedule-info", authenticate, requireAdmin, adminController.getRssScheduleInfo);


module.exports = router;
