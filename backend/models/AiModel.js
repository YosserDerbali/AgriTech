const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const AiModel = sequelize.define("AiModel", {
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
    allowNull: true,
    validate: {
      min: 0,
      max: 100,
    },
  },
  totalPredictions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastUpdated: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: "ai_models",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

module.exports = { AiModel };
