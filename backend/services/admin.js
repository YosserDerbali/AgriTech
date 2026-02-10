const { User } = require("../models/User");

// Get all users
exports.getAllUsers = async () => {
  return await User.findAll({
    attributes: ['id', 'name', 'email', 'role', 'isActive', 'created_at', 'lastLoginAt'],
    order: [['created_at', 'DESC']],
  });
};

// Update a user's role
exports.updateUserRole = async (userId, newRole) => {
  if (!["FARMER", "AGRONOMIST", "ADMIN"].includes(newRole)) {
    throw new Error("Invalid role");
  }

  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  user.role = newRole;
  await user.save();
  return user;
};

// Update a user's status (active/inactive)
exports.updateUserStatus = async (userId, isActive) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  user.isActive = isActive;
  await user.save();
  return user;
};

// Delete a user (hard delete)
exports.deleteUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  await user.destroy();
  return { id: userId, message: "User deleted successfully" };
};
