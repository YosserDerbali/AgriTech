import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Plant } from "./Plant.js";

export const Disease = sequelize.define(
  "Disease",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    plant_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    symptoms: { type: DataTypes.TEXT, allowNull: true },
    treatment: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "diseases",
    timestamps: false,
  }
);

Plant.hasMany(Disease, { foreignKey: "plant_id" });
Disease.belongsTo(Plant, { foreignKey: "plant_id" });
