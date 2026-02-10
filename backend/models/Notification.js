import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { User } from "./User.js";

export const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: { type: DataTypes.UUID, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    read: { type: DataTypes.BOOLEAN, defaultValue: false },
    deleted_at: { type: DataTypes.DATE },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "notifications",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: false,
    deletedAt: "deleted_at",
  }
);

User.hasMany(Notification, { foreignKey: "user_id" });
Notification.belongsTo(User, { foreignKey: "user_id" });
