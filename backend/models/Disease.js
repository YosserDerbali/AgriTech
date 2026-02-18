const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const Disease = sequelize.define(
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

module.exports = { Disease };
