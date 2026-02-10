import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { User } from "./User.js";

export const AgronomistProfile = sequelize.define(
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

User.hasOne(AgronomistProfile, { foreignKey: "user_id" });
AgronomistProfile.belongsTo(User, { foreignKey: "user_id" });
