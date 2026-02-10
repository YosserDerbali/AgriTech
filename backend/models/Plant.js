import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Plant = sequelize.define(
  "Plant",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "plants",
    timestamps: false,
  }
);
