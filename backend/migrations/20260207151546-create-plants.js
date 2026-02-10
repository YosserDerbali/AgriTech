'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('plants', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: true },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('plants');
}
