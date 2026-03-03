'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "specialties", {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      allowNull: true,
    });

    await queryInterface.addColumn("users", "experience_years", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "bio", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("users", "specialties");
    await queryInterface.removeColumn("users", "experience_years");
    await queryInterface.removeColumn("users", "bio");
  },
};