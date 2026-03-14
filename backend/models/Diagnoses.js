const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const Diagnoses = sequelize.define(
  "Diagnoses",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
     user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    plant_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    disease_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    confidence: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "APPROVED",
        "PENDING",
        "COMPLETED",
        "REVIEWED",
        "REJECTED"
      ),
      allowNull: false,
      defaultValue: "PENDING",
    },

    treatment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    agronomist_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "diagnoses",
    timestamps: false,
  }
);

module.exports = { Diagnoses };
