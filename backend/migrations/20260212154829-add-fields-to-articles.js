"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("articles", "author_name", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("articles", "excerpt", {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: "",
    });

    await queryInterface.addColumn("articles", "cover_image_url", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("articles", "tags", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
      defaultValue: [],
    });

    await queryInterface.addColumn("articles", "published", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });

    await queryInterface.addColumn("articles", "updated_at", {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("articles", "author_name");
    await queryInterface.removeColumn("articles", "excerpt");
    await queryInterface.removeColumn("articles", "cover_image_url");
    await queryInterface.removeColumn("articles", "tags");
    await queryInterface.removeColumn("articles", "published");
    await queryInterface.removeColumn("articles", "updated_at");
  },
};
