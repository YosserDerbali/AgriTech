const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const Plant = sequelize.define(
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

module.exports = { Plant };
