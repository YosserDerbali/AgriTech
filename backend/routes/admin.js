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

// AI Models management
router.get("/ai-models", authenticate, requireAdmin, adminController.getAllAiModels);
router.post("/ai-models", authenticate, requireAdmin, adminController.createAiModel);
router.patch("/ai-models/:modelId", authenticate, requireAdmin, adminController.toggleAiModel);
router.delete("/ai-models/:modelId", authenticate, requireAdmin, adminController.deleteAiModel);

// System Settings management
router.get("/settings", authenticate, requireAdmin, adminController.getSystemSettings);
router.put("/settings", authenticate, requireAdmin, adminController.updateSystemSettings);

// RSS Configuration management
router.get("/rss-configurations", authenticate, requireAdmin, adminController.getAllRssConfigurations);
router.get("/rss-configurations/category/:category", authenticate, requireAdmin, adminController.getRssConfigurationsByCategory);
router.patch("/rss-configurations/:key", authenticate, requireAdmin, adminController.updateRssConfiguration);
router.post("/rss-configurations/validate-feed", authenticate, requireAdmin, adminController.validateRssFeed);
router.post("/rss-configurations/preview-sync", authenticate, requireAdmin, adminController.previewRssSync);
router.post("/rss-configurations/trigger-sync", authenticate, requireAdmin, adminController.triggerRssSync);
router.get("/rss-configurations/schedule-info", authenticate, requireAdmin, adminController.getRssScheduleInfo);
// ── Diagnoses Management ───────────────────────────────────────────────

// 🔹 Get all diagnoses
router.get(
  "/diagnoses",
  authenticate,
  requireAdmin,
  adminController.getAllDiagnoses
);

// ── AI Models Management ───────────────────────────────────────────────

// 🔹 Get all AI models
router.get(
  "/ai-models",
  authenticate,
  requireAdmin,
  adminController.getAllAiModels
);
router.get(
  "/articles",
  authenticate,requireAdmin,
  adminController.getAllArticles
);

module.exports = router;
