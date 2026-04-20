"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if ai_model_id already exists (idempotent)
    const table = await queryInterface.describeTable("diagnoses");
    
    if (!table.ai_model_id) {
      // Add ai_model_id column
      await queryInterface.addColumn("diagnoses", "ai_model_id", {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "ai_models",
          key: "id",
        },
        onDelete: "SET NULL",
      });
    }

    // Remove ai_model_version column if it exists
    if (table.ai_model_version) {
      await queryInterface.removeColumn("diagnoses", "ai_model_version");
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("diagnoses");
    
    // Restore ai_model_version column if it doesn't exist
    if (!table.ai_model_version) {
      await queryInterface.addColumn("diagnoses", "ai_model_version", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    // Remove ai_model_id column if it exists
    if (table.ai_model_id) {
      await queryInterface.removeColumn("diagnoses", "ai_model_id");
    }
  },
};
