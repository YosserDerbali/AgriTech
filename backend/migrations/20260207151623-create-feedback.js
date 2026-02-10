'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('feedback', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    prediction_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'predictions', key: 'id' }, onDelete: 'CASCADE' },
    user_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
    comment: { type: Sequelize.TEXT, allowNull: true },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('feedback');
}
