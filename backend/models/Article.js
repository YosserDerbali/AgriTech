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
    author_name: { type: DataTypes.STRING, allowNull: true }, // denormalized for frontend
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    excerpt: { type: DataTypes.TEXT, allowNull: false },
    cover_image_url: { type: DataTypes.TEXT, allowNull: true },
    source: {
      type: DataTypes.ENUM("AGRONOMIST", "EXTERNAL"),
      allowNull: false,
    },
    external_url: { type: DataTypes.TEXT, allowNull: true },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING), // PostgreSQL
      allowNull: false,
      defaultValue: [],
    },
    published: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "articles",
    timestamps: false,
  }
);

User.hasMany(Article, { foreignKey: "author_id" });
Article.belongsTo(User, { foreignKey: "author_id" });
