"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("diagnosis", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      image_url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      plant_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      disease_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      confidence: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM(
          "PENDING",
          "APPROVED",
          "REJECTED"
        ),
        allowNull: false,
        defaultValue: "PENDING",
      },
      treatment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      agronomist_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("diagnosis");
  },
};