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
