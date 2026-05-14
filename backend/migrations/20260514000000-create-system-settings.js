'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('system_settings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      maintenanceMode: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      maxImageSizeMB: {
        type: Sequelize.INTEGER,
        defaultValue: 10,
        allowNull: false,
      },
      confidenceThreshold: {
        type: Sequelize.FLOAT,
        defaultValue: 0.8,
        allowNull: false,
      },
      notificationsEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      externalBlogSyncEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      externalBlogSyncIntervalHours: {
        type: Sequelize.INTEGER,
        defaultValue: 6,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('system_settings');
  },
};
