const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const AgronomistProfile = sequelize.define(
  "AgronomistProfile",
  {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    specialties: { type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: true },
    experience_years: { type: DataTypes.INTEGER, allowNull: true },
    bio: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "agronomist_profiles",
    timestamps: false,
  }
);

module.exports = { AgronomistProfile };
