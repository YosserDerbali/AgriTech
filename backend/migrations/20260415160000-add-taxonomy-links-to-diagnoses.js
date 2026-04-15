'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('diagnoses', 'image_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'images', key: 'id' },
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('diagnoses', 'plant_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'plants', key: 'id' },
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('diagnoses', 'disease_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'diseases', key: 'id' },
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('diagnoses', 'symptoms', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('diagnoses', 'symptoms');
    await queryInterface.removeColumn('diagnoses', 'disease_id');
    await queryInterface.removeColumn('diagnoses', 'plant_id');
    await queryInterface.removeColumn('diagnoses', 'image_id');
  },
};