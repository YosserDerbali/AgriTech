"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("diagnoses");
    if (!table.user_id) {
      await queryInterface.addColumn("diagnoses", "user_id", {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("diagnoses");
    if (table.user_id) {
      await queryInterface.removeColumn("diagnoses", "user_id");
    }
  },
};