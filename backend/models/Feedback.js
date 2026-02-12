import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Prediction } from "./Prediction.js";
import { User } from "./User.js";

export const Feedback = sequelize.define(
  "Feedback",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    prediction_id: { type: DataTypes.UUID, allowNull: false },
    user_id: { type: DataTypes.UUID, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "feedback",
    timestamps: false,
  }
);

Prediction.hasMany(Feedback, { foreignKey: "prediction_id" });
Feedback.belongsTo(Prediction, { foreignKey: "prediction_id" });

User.hasMany(Feedback, { foreignKey: "user_id" });
Feedback.belongsTo(User, { foreignKey: "user_id" });

//remark: I think it should be 1 to 1 relationship between Feedback and Prediction, but I will keep it as is for now.