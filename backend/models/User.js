const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password_hash: { type: DataTypes.TEXT, allowNull: false },
    role: {
      type: DataTypes.ENUM("FARMER", "AGRONOMIST", "ADMIN"),
      allowNull: false,
    },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    lastLoginAt: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

module.exports = { User };
