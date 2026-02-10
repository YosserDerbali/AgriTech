'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('notifications', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    user_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
    message: { type: Sequelize.TEXT, allowNull: false },
    read: { type: Sequelize.BOOLEAN, defaultValue: false },
    deleted_at: { type: Sequelize.DATE },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('notifications');
}
