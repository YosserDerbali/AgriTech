const adminService = require("../services/admin");
const rssConfigService = require("../services/rssConfigService");
const { rescheduleRssSync, getScheduleInfo, syncArticlesFromRSS } = require("../services/cronRescheduler");

// Helper to remove sensitive fields
const sanitizeUser = (user) => {
  const { password_hash, ...safeUser } = user.toJSON();
  return safeUser;
};

// 🔹 Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    console.log("Fetched users:", users);
    res.json({
      success: true,
      data: users.map(sanitizeUser),
    });
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🔹 Create user
exports.createUser = async (req, res) => {
  try {
    const newUser = await adminService.createUser(req.body);

    res.status(201).json({
      success: true,
      data: sanitizeUser(newUser),
    });
  } catch (err) {
    console.error("Create user error:", err);

    if (err.message === "Email already in use") {
      return res.status(409).json({ success: false, message: err.message });
    }

    if (err.message === "Invalid role") {
      return res.status(400).json({ success: false, message: err.message });
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🔹 Update user details (including self)
exports.updateUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const updatedUser = await adminService.updateUserDetails(
      userId,
      req.body
    );

    res.json({
      success: true,
      data: sanitizeUser(updatedUser),
    });
  } catch (err) {
    console.error("Update user details error:", err);

    if (err.message === "User not found") {
      return res.status(404).json({ success: false, message: err.message });
    }

    if (err.message === "Email already in use") {
      return res.status(409).json({ success: false, message: err.message });
    }

    if (err.message === "Invalid role") {
      return res.status(400).json({ success: false, message: err.message });
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🔹 Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await adminService.updateUserRole(userId, role);

    res.json({
      success: true,
      data: sanitizeUser(user),
    });
  } catch (err) {
    console.error("Update user role error:", err);

    if (err.message === "User not found") {
      return res.status(404).json({ success: false, message: err.message });
    }

    if (err.message === "Invalid role") {
      return res.status(400).json({ success: false, message: err.message });
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🔹 Update user status
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
  

    const user = await adminService.updateUserStatus(userId);

    res.json({
      success: true,
      data: sanitizeUser(user),
    });
  } catch (err) {
    console.error("Update user status error:", err);

    if (err.message === "User not found") {
      return res.status(404).json({ success: false, message: err.message });
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🔹 Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent self-delete
    // if (userId === req.user.id) {
    //   return res
    //     .status(403)
    //     .json({ success: false, message: "Admins cannot delete themselves" });
    // }

    const user = await adminService.deleteUser(userId);

    res.json({
      success: true,
      message: "User deleted successfully",
      data: sanitizeUser(user),
    });
  } catch (err) {
    console.error("Delete user error:", err);

    if (err.message === "User not found") {
      return res.status(404).json({ success: false, message: err.message });
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ── RSS Configuration Endpoints ───────────────────────────────────────────────

// 🔹 Get all RSS configurations
exports.getAllRssConfigurations = async (req, res) => {
  try {
    const configurations = await rssConfigService.getAllConfigurations();
    res.json({
      success: true,
      data: configurations,
    });
  } catch (err) {
    console.error("Get all RSS configurations error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🔹 Get RSS configurations by category
exports.getRssConfigurationsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const configurations = await rssConfigService.getConfigurationsByCategory(category);
    res.json({
      success: true,
      data: configurations,
    });
  } catch (err) {
    console.error(`Get RSS configurations for category ${category} error:`, err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🔹 Update RSS configuration
exports.updateRssConfiguration = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({ success: false, message: "Value is required" });
    }

    const result = await rssConfigService.updateConfiguration(key, { value });

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error });
    }

    // Check if this is a scheduling configuration that requires cron rescheduling
    const schedulingKeys = ["sync_enabled", "sync_interval_hours", "sync_time_hour"];
    if (schedulingKeys.includes(key)) {
      console.log(`📰 Scheduling config changed (${key}), rescheduling RSS sync...`);
      await rescheduleRssSync();
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (err) {
    console.error(`Update RSS configuration ${req.params.key} error:`, err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🔹 Validate RSS feed URL
exports.validateRssFeed = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, message: "URL is required" });
    }

    const result = await rssConfigService.validateFeedUrl(url);

    if (result.valid) {
      res.json({
        success: true,
        data: result,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error,
        data: result,
      });
    }
  } catch (err) {
    console.error("Validate RSS feed error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🔹 Preview RSS sync (dry run)
exports.previewRssSync = async (req, res) => {
  try {
    const result = await rssConfigService.previewFeedSync();

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Preview RSS sync error:", err);
    res.status(500).json({ success: false, message: err.message || "Internal server error" });
  }
};

// 🔹 Trigger manual RSS sync
exports.triggerRssSync = async (req, res) => {
  try {
    // Run sync in background
    syncArticlesFromRSS();

    res.json({
      success: true,
      message: "RSS sync triggered successfully. Check server logs for progress.",
    });
  } catch (err) {
    console.error("Trigger RSS sync error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🔹 Get RSS schedule information
exports.getRssScheduleInfo = async (req, res) => {
  try {
    const scheduleInfo = await getScheduleInfo();

    if (!scheduleInfo) {
      return res.status(500).json({ success: false, message: "Failed to get schedule info" });
    }

    res.json({
      success: true,
      data: scheduleInfo,
    });
  } catch (err) {
    console.error("Get RSS schedule info error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// ── Diagnoses Endpoints ───────────────────────────────────────────────

// 🔹 Get all diagnoses
exports.getAllDiagnoses = async (req, res) => {
  try {
    const diagnoses = await adminService.getAllDiagnoses();

    res.json({
      success: true,
      data: diagnoses,
    });
  } catch (err) {
    console.error("Get all diagnoses error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ── AI Models Endpoints ───────────────────────────────────────────────

// 🔹 Get all AI models
exports.getAllAiModels = async (req, res) => {
  try {
    const models = await adminService.getAllAiModels();

    res.json({
      success: true,
      data: models,
    });
  } catch (err) {
    console.error("Get all AI models error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// 🔹 Create AI model
exports.createAiModel = async (req, res) => {
  try {
    const { name, version, type, accuracy, isEnabled = true } = req.body;
    if (!name || !version || !type || accuracy === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const { AiModel } = require('../models');

    const model = await AiModel.create({
      name,
      version,
      type,
      accuracy,
      isEnabled,
      totalPredictions: 0,
      lastUpdated: new Date(),
    });

    res.status(201).json({ success: true, data: model });
  } catch (err) {
    console.error('Create AI model error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// 🔹 Toggle AI model enabled/disabled
exports.toggleAiModel = async (req, res) => {
  try {
    const { modelId } = req.params;
    const { AiModel } = require('../models');

    const model = await AiModel.findByPk(modelId);
    if (!model) return res.status(404).json({ success: false, message: 'Model not found' });

    model.isEnabled = !model.isEnabled;
    model.lastUpdated = new Date();
    await model.save();

    res.json({ success: true, data: model });
  } catch (err) {
    console.error('Toggle AI model error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// 🔹 Delete AI model
exports.deleteAiModel = async (req, res) => {
  try {
    const { modelId } = req.params;
    const { AiModel } = require('../models');

    const model = await AiModel.findByPk(modelId);
    if (!model) return res.status(404).json({ success: false, message: 'Model not found' });

    await model.destroy();
    res.json({ success: true, message: 'Model deleted' });
  } catch (err) {
    console.error('Delete AI model error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await adminService.getAllArticles();

    res.json({
      success: true,
      data: articles,
    });
  } catch (err) {
    console.error("Get all articles error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// 🔹 Get system settings
exports.getSystemSettings = async (req, res) => {
  try {
    const { SystemSettings } = require('../models');

    let settings = await SystemSettings.findOne();

    // If no settings exist, create default ones
    if (!settings) {
      settings = await SystemSettings.create({
        maintenanceMode: false,
        maxImageSizeMB: 10,
        confidenceThreshold: 0.8,
        notificationsEnabled: true,
        externalBlogSyncEnabled: false,
        externalBlogSyncIntervalHours: 6,
      });
    }

    res.json({
      success: true,
      data: settings,
    });
  } catch (err) {
    console.error("Get system settings error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🔹 Update system settings
exports.updateSystemSettings = async (req, res) => {
  try {
    const {
      maintenanceMode,
      maxImageSizeMB,
      confidenceThreshold,
      notificationsEnabled,
      externalBlogSyncEnabled,
      externalBlogSyncIntervalHours,
    } = req.body;

    const { SystemSettings } = require('../models');

    const settings = await SystemSettings.findOne();
    if (!settings) {
      return res.status(404).json({ success: false, message: 'Settings not found' });
    }

    // Validation
    if (maxImageSizeMB !== undefined) {
      if (maxImageSizeMB < 1 || maxImageSizeMB > 50) {
        return res.status(400).json({
          success: false,
          message: 'maxImageSizeMB must be between 1 and 50',
        });
      }
      settings.maxImageSizeMB = maxImageSizeMB;
    }

    if (confidenceThreshold !== undefined) {
      if (confidenceThreshold < 0.5 || confidenceThreshold > 0.95) {
        return res.status(400).json({
          success: false,
          message: 'confidenceThreshold must be between 0.5 and 0.95',
        });
      }
      settings.confidenceThreshold = confidenceThreshold;
    }

    if (externalBlogSyncIntervalHours !== undefined) {
      if (externalBlogSyncIntervalHours < 1 || externalBlogSyncIntervalHours > 24) {
        return res.status(400).json({
          success: false,
          message: 'externalBlogSyncIntervalHours must be between 1 and 24',
        });
      }
      settings.externalBlogSyncIntervalHours = externalBlogSyncIntervalHours;
    }

    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    if (notificationsEnabled !== undefined) settings.notificationsEnabled = notificationsEnabled;
    if (externalBlogSyncEnabled !== undefined) settings.externalBlogSyncEnabled = externalBlogSyncEnabled;

    await settings.save();

    res.json({ success: true, data: settings });
  } catch (err) {
    console.error('Update system settings error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

