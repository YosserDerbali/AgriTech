'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('images', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    user_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
    plant_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'plants', key: 'id' } },
    image_url: { type: Sequelize.TEXT, allowNull: false },
    uploaded_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('images');
}
