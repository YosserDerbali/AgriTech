const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const Image = sequelize.define(
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

module.exports = { Image };
