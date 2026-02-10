import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Image } from "./Image.js";
import { Disease } from "./Disease.js";
import { User } from "./User.js";

export const Prediction = sequelize.define(
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

Image.hasMany(Prediction, { foreignKey: "image_id" });
Prediction.belongsTo(Image, { foreignKey: "image_id" });

Disease.hasMany(Prediction, { foreignKey: "disease_id" });
Prediction.belongsTo(Disease, { foreignKey: "disease_id" });

User.hasMany(Prediction, { foreignKey: "validated_by" });
Prediction.belongsTo(User, { foreignKey: "validated_by", as: "validator" });
