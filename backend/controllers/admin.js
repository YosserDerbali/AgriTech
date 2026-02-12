const adminService = require("../services/admin");

// Helper to remove sensitive fields
const sanitizeUser = (user) => {
  const { password_hash, ...safeUser } = user.toJSON();
  return safeUser;
};

// 🔹 Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
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
    const { isActive } = req.body;

    const user = await adminService.updateUserStatus(userId, isActive);

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
    if (userId === req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Admins cannot delete themselves" });
    }

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
