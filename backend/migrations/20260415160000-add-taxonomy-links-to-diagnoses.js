'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('diagnoses');

    if (!table.image_id) {
      await queryInterface.addColumn('diagnoses', 'image_id', {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'images', key: 'id' },
        onDelete: 'SET NULL',
      });
    }

    if (!table.plant_id) {
      await queryInterface.addColumn('diagnoses', 'plant_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'plants', key: 'id' },
        onDelete: 'SET NULL',
      });
    }

    if (!table.disease_id) {
      await queryInterface.addColumn('diagnoses', 'disease_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'diseases', key: 'id' },
        onDelete: 'SET NULL',
      });
    }

    if (!table.symptoms) {
      await queryInterface.addColumn('diagnoses', 'symptoms', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable('diagnoses');

    if (table.symptoms) {
      await queryInterface.removeColumn('diagnoses', 'symptoms');
    }
    if (table.disease_id) {
      await queryInterface.removeColumn('diagnoses', 'disease_id');
    }
    if (table.plant_id) {
      await queryInterface.removeColumn('diagnoses', 'plant_id');
    }
    if (table.image_id) {
      await queryInterface.removeColumn('diagnoses', 'image_id');
    }
  },
};