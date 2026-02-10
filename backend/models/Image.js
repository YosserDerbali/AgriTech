import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { User } from "./User.js";
import { Plant } from "./Plant.js";

export const Image = sequelize.define(
  "Image",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: { type: DataTypes.UUID, allowNull: false },
    plant_id: { type: DataTypes.INTEGER, allowNull: true },
    image_url: { type: DataTypes.TEXT, allowNull: false },
    uploaded_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "images",
    timestamps: false,
  }
);

User.hasMany(Image, { foreignKey: "user_id" });
Image.belongsTo(User, { foreignKey: "user_id" });

Plant.hasMany(Image, { foreignKey: "plant_id" });
Image.belongsTo(Plant, { foreignKey: "plant_id" });
