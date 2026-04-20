const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const AiModel = sequelize.define(
  "AiModel",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    version: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    isEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    accuracy: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    totalPredictions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    lastUpdated: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "ai_models",
    timestamps: false, // ⭐ THIS IS THE IMPORTANT PART
  }
);

module.exports = { AiModel };