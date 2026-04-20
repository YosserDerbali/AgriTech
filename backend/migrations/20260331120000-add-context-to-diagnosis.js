"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("diagnoses");
    if (!table.context) {
      await queryInterface.addColumn("diagnoses", "context", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable("diagnoses");
    if (table.context) {
      await queryInterface.removeColumn("diagnoses", "context");
    }
  },
};
