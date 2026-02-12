import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { User } from "./User.js";

export const Article = sequelize.define(
  "Article",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    author_id: { type: DataTypes.UUID, allowNull: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    source: {
      type: DataTypes.ENUM("AGRONOMIST", "EXTERNAL"),
      allowNull: false,
    },
    external_url: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "articles",
    timestamps: false,
  }
);

User.hasMany(Article, { foreignKey: "author_id" });
Article.belongsTo(User, { foreignKey: "author_id" });

//we need to add fields to this table (cover_image_url, tags, etc...)