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
    const safeUsers = users.map(sanitizeUser);
    res.json({ success: true, data: safeUsers });
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🔹 Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["FARMER", "AGRONOMIST", "ADMIN"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    if (userId === req.user.id) {
      return res.status(403).json({ success: false, message: "Admins cannot change their own role" });
    }

    const user = await adminService.updateUserRole(userId, role);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, data: sanitizeUser(user) });
  } catch (err) {
    console.error("Update user role error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🔹 Update user status (active/inactive)
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ success: false, message: "isActive must be true or false" });
    }

    const user = await adminService.updateUserStatus(userId, isActive);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, data: sanitizeUser(user) });
  } catch (err) {
    console.error("Update user status error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🔹 Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.id) {
      return res.status(403).json({ success: false, message: "Admins cannot delete themselves" });
    }

    const user = await adminService.deleteUser(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User deleted successfully", data: sanitizeUser(user) });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
