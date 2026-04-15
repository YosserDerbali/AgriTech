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

    image_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "images",
        key: "id",
      },
      onDelete: "SET NULL",
    },

    plant_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "plants",
        key: "id",
      },
      onDelete: "SET NULL",
    },

    disease_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "diseases",
        key: "id",
      },
      onDelete: "SET NULL",
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

    symptoms: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    context: {
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
