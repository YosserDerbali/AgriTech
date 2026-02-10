'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('diseases', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    plant_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'plants', key: 'id' }, onDelete: 'CASCADE' },
    name: { type: Sequelize.STRING, allowNull: false },
    symptoms: { type: Sequelize.TEXT, allowNull: true },
    treatment: { type: Sequelize.TEXT, allowNull: true },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('diseases');
}
