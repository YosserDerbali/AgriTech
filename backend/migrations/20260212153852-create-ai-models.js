"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ai_models", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: { type: Sequelize.STRING, allowNull: false },
      version: { type: Sequelize.STRING, allowNull: false },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isEnabled: { type: Sequelize.BOOLEAN, defaultValue: true },
      accuracy: { type: Sequelize.FLOAT, allowNull: false },
      totalPredictions: { type: Sequelize.INTEGER, defaultValue: 0 },
      lastUpdated: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ai_models");
  },
};
