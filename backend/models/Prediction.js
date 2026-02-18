const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const Prediction = sequelize.define(
  "Prediction",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    image_id: { type: DataTypes.UUID, allowNull: false },
    disease_id: { type: DataTypes.INTEGER, allowNull: true },
    confidence: { type: DataTypes.FLOAT, allowNull: true },
    ai_model_version: { type: DataTypes.STRING, allowNull: true },
    validated: { type: DataTypes.BOOLEAN, defaultValue: false },
    validated_by: { type: DataTypes.UUID, allowNull: true },
    status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
      defaultValue: "PENDING",
    },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "predictions",
    timestamps: false,
  }
);

module.exports = { Prediction };
