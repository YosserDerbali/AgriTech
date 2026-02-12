const { User } = require("../models/User");
const bcrypt = require("bcryptjs");

// 🔹 Get all users
exports.getAllUsers = async () => {
  return await User.findAll({
    attributes: ["id", "name", "email", "role", "isActive", "created_at", "lastLoginAt"],
    order: [["created_at", "DESC"]],
  });
};

// 🔹 Create a new user
exports.createUser = async ({ name, email, role, isActive = true, password }) => {
  if (!["FARMER", "AGRONOMIST", "ADMIN"].includes(role)) {
    throw new Error("Invalid role");
  }

  // Check if email already exists
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error("Email already in use");

  const password_hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    role,
    isActive,
    password_hash,
  });

  return user;
};

// 🔹 Update a user's details (name, email, role, isActive, password)
exports.updateUserDetails = async (userId, data) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const { name, email, role, isActive, password } = data;

  if (role && !["FARMER", "AGRONOMIST", "ADMIN"].includes(role)) {
    throw new Error("Invalid role");
  }

  if (email && email !== user.email) {
    const existing = await User.findOne({ where: { email } });
    if (existing) throw new Error("Email already in use");
  }

  if (password) {
    user.password_hash = await bcrypt.hash(password, 10);
  }

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save();
  return user;
};

// 🔹 Update a user's role
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

// 🔹 Update a user's status (active/inactive)
exports.updateUserStatus = async (userId, isActive) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  user.isActive = isActive;
  await user.save();
  return user;
};

// 🔹 Delete a user (hard delete)
exports.deleteUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  await user.destroy();
  return user;
};
