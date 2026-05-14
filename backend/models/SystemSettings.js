const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const SystemSettings = sequelize.define(
  "SystemSetting",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    maintenanceMode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    maxImageSizeMB: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      allowNull: false,
      validate: {
        min: 1,
        max: 50,
      },
    },

    confidenceThreshold: {
      type: DataTypes.FLOAT,
      defaultValue: 0.8,
      allowNull: false,
      validate: {
        min: 0.5,
        max: 0.95,
      },
    },

    notificationsEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },

    externalBlogSyncEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    externalBlogSyncIntervalHours: {
      type: DataTypes.INTEGER,
      defaultValue: 6,
      allowNull: false,
      validate: {
        min: 1,
        max: 24,
      },
    },
  },
  {
    tableName: "system_settings",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

module.exports = { SystemSettings };
